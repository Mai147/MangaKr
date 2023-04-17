import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { Community } from "@/models/Community";
import { UserModel, UserSnippet } from "@/models/User";
import { Voting, VotingOption } from "@/models/Vote";
import FileUtils from "@/utils/FileUtils";
import { triGram } from "@/utils/StringUtils";
import UserUtils from "@/utils/UserUtils";
import { VotingUtils } from "@/utils/VotingUtils";
import {
    collection,
    collectionGroup,
    doc,
    getDoc,
    getDocs,
    increment,
    limit,
    query,
    runTransaction,
    serverTimestamp,
    Timestamp,
    where,
    writeBatch,
} from "firebase/firestore";
import CommunityService from "./CommunityService";

class VotingService {
    static get = async ({
        votingId,
        communityId,
    }: {
        votingId: string;
        communityId: string;
    }) => {
        const votingDocRef = doc(
            fireStore,
            firebaseRoute.getCommunityVotingRoute(communityId),
            votingId
        );
        const votingDoc = await getDoc(votingDocRef);
        if (votingDoc.exists()) {
            return VotingUtils.fromDoc(votingDoc);
        }
    };
    static create = async ({
        votingForm,
        community,
    }: {
        votingForm: Voting;
        community: Community;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            const votingDocRef = doc(
                collection(
                    fireStore,
                    firebaseRoute.getCommunityVotingRoute(community.id!)
                )
            );
            const communityDocRef = doc(
                fireStore,
                firebaseRoute.getAllCommunityRoute(),
                community.id!
            );
            const { options, ...data } = votingForm;
            const trigramContent = triGram(votingForm.content);
            const trigramCreatorName = triGram(votingForm.creatorDisplayName);
            batch.set(votingDocRef, {
                ...data,
                id: votingDocRef.id,
                communityId: community.id,
                numberOfOptions: votingForm.options.length,
                trigramContent: {
                    ...trigramContent.obj,
                    ...trigramCreatorName.obj,
                },
                createdAt: serverTimestamp() as Timestamp,
            });
            for (const option of votingForm.options) {
                const votingOptionDocRef = doc(
                    collection(
                        fireStore,
                        firebaseRoute.getCommunityVotingOptionRoute(
                            community.id!,
                            votingDocRef.id
                        )
                    )
                );
                batch.set(votingOptionDocRef, {
                    ...option,
                    id: votingOptionDocRef.id,
                    imageUrl: "",
                    imageRef: "",
                });
                const res = await FileUtils.uploadFile({
                    imageRoute: firebaseRoute.getCommunityVotingImageRoute(
                        community.id!,
                        votingDocRef.id,
                        votingOptionDocRef.id
                    ),
                    imageUrl: option.imageUrl,
                });
                if (res) {
                    batch.update(votingOptionDocRef, {
                        imageUrl: res.downloadUrl,
                        imageRef: res.downloadRef,
                    });
                }
            }
            batch.update(communityDocRef, {
                numberOfVotings: increment(1),
            });
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };
    static approve = async ({
        voting,
        community,
        isAccept,
    }: {
        voting: Voting;
        community: Community;
        isAccept: boolean;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            let votingDocRef = doc(
                fireStore,
                firebaseRoute.getCommunityVotingRoute(community.id!),
                voting.id!
            );
            const communityDocRef = doc(
                fireStore,
                firebaseRoute.getAllCommunityRoute(),
                community.id!
            );
            if (isAccept) {
                // Community noti
                await CommunityService.updateNotification({
                    community,
                    creatorDisplayName: voting.creatorDisplayName!,
                    type: "VOTING",
                });
                batch.update(communityDocRef, {
                    numberOfVotings: increment(1),
                });
                batch.update(votingDocRef, {
                    isAccept,
                });
            } else {
                batch.delete(votingDocRef);
            }
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };
    static getOptions = async ({
        communityId,
        votingId,
    }: {
        communityId: string;
        votingId: string;
    }) => {
        const votingOptionDocsRef = collection(
            fireStore,
            firebaseRoute.getCommunityVotingOptionRoute(communityId, votingId)
        );
        const votingOptionDocs = await getDocs(votingOptionDocsRef);
        return votingOptionDocs.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as VotingOption)
        );
    };
    static getOptionVotes = async ({
        votingOptionId,
        communityId,
        votingId,
    }: {
        votingOptionId: string;
        communityId: string;
        votingId: string;
    }) => {
        const votingOptionVoteDocsRef = collection(
            fireStore,
            firebaseRoute.getCommunityVotingOptionVoteRoute(
                communityId,
                votingId,
                votingOptionId
            )
        );
        const votingOptionVoteDocs = await getDocs(votingOptionVoteDocsRef);
        const votingOptionVotes = votingOptionVoteDocs.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as UserSnippet)
        );
        return votingOptionVotes;
    };
    static vote = async ({
        user,
        votingOptionId,
        votingId,
        communityId,
        userVoteOptionId,
    }: {
        user: UserModel;
        votingOptionId: string;
        votingId: string;
        communityId: string;
        userVoteOptionId?: string;
    }) => {
        try {
            let res = {
                totalChange: 0,
                currentChange: 0,
                voteChange: 0,
            };
            await runTransaction(fireStore, async (transaction) => {
                const votingDocRef = doc(
                    fireStore,
                    firebaseRoute.getCommunityVotingRoute(communityId),
                    votingId
                );
                const votingOptionDocRef = doc(
                    fireStore,
                    firebaseRoute.getCommunityVotingOptionRoute(
                        communityId,
                        votingId
                    ),
                    votingOptionId
                );
                const votingOptionVoteDocRef = doc(
                    fireStore,
                    firebaseRoute.getCommunityVotingOptionVoteRoute(
                        communityId,
                        votingId,
                        votingOptionId
                    ),
                    user.uid
                );
                const userVotingVoteDocRef = doc(
                    fireStore,
                    firebaseRoute.getUserVotingVoteRoute(user.uid),
                    votingId
                );
                if (userVoteOptionId) {
                    if (userVoteOptionId === votingOptionId) {
                        // REMOVE VOTE
                        transaction.delete(votingOptionVoteDocRef);
                        transaction.update(votingOptionDocRef, {
                            numberOfVotes: increment(-1),
                        });
                        transaction.update(votingDocRef, {
                            numberOfVotes: increment(-1),
                        });
                        transaction.delete(userVotingVoteDocRef);
                        res = {
                            totalChange: -1,
                            currentChange: -1,
                            voteChange: 0,
                        };
                    } else {
                        const currentVotingOptionDocRef = doc(
                            fireStore,
                            firebaseRoute.getCommunityVotingOptionRoute(
                                communityId,
                                votingId
                            ),
                            userVoteOptionId
                        );
                        const currentVotingOptionVoteDocRef = doc(
                            fireStore,
                            firebaseRoute.getCommunityVotingOptionVoteRoute(
                                communityId,
                                votingId,
                                userVoteOptionId
                            ),
                            user.uid
                        );
                        // CHANGE VOTE
                        transaction.set(votingOptionVoteDocRef, {
                            ...UserUtils.toUserSnippet(user),
                            votingId,
                        });
                        transaction.delete(currentVotingOptionVoteDocRef);
                        transaction.update(currentVotingOptionDocRef, {
                            numberOfVotes: increment(-1),
                        });
                        transaction.update(votingOptionDocRef, {
                            numberOfVotes: increment(1),
                        });
                        transaction.update(userVotingVoteDocRef, {
                            votingOptionId,
                        });
                        res = {
                            totalChange: 0,
                            currentChange: -1,
                            voteChange: 1,
                        };
                    }
                } else {
                    // ADD VOTE
                    transaction.set(votingOptionVoteDocRef, {
                        ...UserUtils.toUserSnippet(user),
                        votingId,
                    });
                    transaction.update(votingOptionDocRef, {
                        numberOfVotes: increment(1),
                    });
                    transaction.update(votingDocRef, {
                        numberOfVotes: increment(1),
                    });
                    transaction.set(userVotingVoteDocRef, {
                        votingOptionId,
                    });
                    res = {
                        totalChange: 1,
                        currentChange: 0,
                        voteChange: 1,
                    };
                }
            });
            return res;
        } catch (error) {
            console.log(error);
        }
    };
    static getVote = async ({
        userId,
        votingId,
    }: {
        userId: string;
        votingId: string;
    }) => {
        const userVotingVoteDocRef = doc(
            fireStore,
            firebaseRoute.getUserVotingVoteRoute(userId),
            votingId
        );
        const userVotingVoteDoc = await getDoc(userVotingVoteDocRef);
        if (userVotingVoteDoc.exists()) {
            const { votingOptionId } = userVotingVoteDoc.data();
            return {
                id: userVotingVoteDoc.id,
                votingOptionId,
            };
        }
    };
    static getVotingVoteSnippet = async ({
        userId,
        votingId,
    }: {
        userId?: string;
        votingId: string;
    }) => {
        const queryConstraint = [];
        const followerConstraint = [];
        const unfollowerConstraint = [];
        const votingVoteDocsRef = collectionGroup(fireStore, "votingVotes");
        queryConstraint.push(where("votingId", "==", votingId));
        let followerIds = [];
        if (userId) {
            const followerDocsRef = collection(
                fireStore,
                firebaseRoute.getUserFollowRoute(userId)
            );
            const followerDocs = await getDocs(followerDocsRef);
            followerIds = followerDocs.docs.map((doc) => doc.id);
            if (followerIds.length > 0) {
                followerConstraint.push(where("id", "in", followerIds));
                unfollowerConstraint.push(where("id", "not-in", followerIds));
            }
        }
        let votingVotes: UserSnippet[] = [];
        const followerVotingVoteQuery = query(
            votingVoteDocsRef,
            ...queryConstraint,
            ...followerConstraint,
            limit(3)
        );
        const followerVotingVoteDocs = await getDocs(followerVotingVoteQuery);
        const followerVotingVotes = followerVotingVoteDocs.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as UserSnippet)
        );
        votingVotes = votingVotes.concat(followerVotingVotes);
        if (followerVotingVoteDocs.docs.length < 3) {
            const unfollowerVotingVoteQuery = query(
                votingVoteDocsRef,
                ...queryConstraint,
                ...unfollowerConstraint,
                limit(3 - followerVotingVoteDocs.docs.length)
            );
            const unfollowerVotingVoteDocs = await getDocs(
                unfollowerVotingVoteQuery
            );
            const unfollowerVotingVotes = unfollowerVotingVoteDocs.docs.map(
                (doc) =>
                    ({
                        id: doc.id,
                        ...doc.data(),
                    } as UserSnippet)
            );
            votingVotes = votingVotes.concat(unfollowerVotingVotes);
        }
        return votingVotes;
    };
}

export default VotingService;
