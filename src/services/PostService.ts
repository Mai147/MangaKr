import { firebaseRoute } from "@/constants/firebaseRoutes";
import { PrivacyType } from "@/constants/privacy";
import { fireStore, storage } from "@/firebase/clientApp";
import { Community } from "@/models/Community";
import { Notification } from "@/models/Notification";
import { LatestPost, Post } from "@/models/Post";
import FileUtils from "@/utils/FileUtils";
import {
    writeBatch,
    doc,
    collection,
    serverTimestamp,
    Timestamp,
    increment,
    getDocs,
    query,
    collectionGroup,
    where,
    getDoc,
    runTransaction,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import CommunityService from "./CommunityService";
import NotificationService from "./NotificationService";

class PostService {
    static create = async ({
        postForm,
        community,
    }: {
        postForm: Post;
        community?: Community;
    }) => {
        try {
            await runTransaction(fireStore, async (transaction) => {
                let postDocRef;
                let rootDocRef;
                if (community) {
                    postDocRef = doc(
                        collection(
                            fireStore,
                            firebaseRoute.getCommunityPostRoute(community.id!)
                        )
                    );
                    rootDocRef = doc(
                        fireStore,
                        firebaseRoute.getAllCommunityRoute(),
                        community.id!
                    );
                } else {
                    postDocRef = doc(
                        collection(
                            fireStore,
                            firebaseRoute.getUserPostRoute(postForm.creatorId)
                        )
                    );
                    rootDocRef = doc(
                        fireStore,
                        firebaseRoute.getAllUserRoute(),
                        postForm.creatorId
                    );
                }

                const res = await FileUtils.uploadMultipleFile({
                    imagesRoute: firebaseRoute.getPostImageRoute(postDocRef.id),
                    imageUrls: postForm.imageUrls,
                });
                transaction.set(postDocRef, {
                    ...postForm,
                    communityId: community?.id,
                    createdAt: serverTimestamp() as Timestamp,
                });
                transaction.update(rootDocRef, {
                    numberOfPosts: increment(1),
                });
                if (res) {
                    transaction.update(postDocRef, {
                        imageUrls: res.downloadUrls,
                        imageRefs: res.downloadRefs,
                    });
                }
                // Notification
                if (!community) {
                    if (postForm.privacyType !== "ONLYME_PRIVACY") {
                        const followedDocsRef = collection(
                            fireStore,
                            firebaseRoute.getUserFollowedRoute(
                                postForm.creatorId
                            )
                        );
                        const followedDocs = await getDocs(followedDocsRef);
                        const followedIds = followedDocs.docs.map(
                            (doc) => doc.id
                        );
                        for (const id of followedIds) {
                            const notification: Notification = {
                                id: postForm.creatorId,
                                creatorDisplayName:
                                    postForm.creatorDisplayName!,
                                imageUrl: postForm.creatorImageUrl,
                                content:
                                    "đã đăng 1 bài viết mới trên trang cá nhân",
                                isSeen: false,
                                isRead: false,
                                type: "FOLLOWED_POST",
                                createdAt: serverTimestamp() as Timestamp,
                            };
                            await NotificationService.updateOrCreate({
                                notification,
                                userId: id,
                            });
                        }
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    static approve = async ({
        post,
        community,
        isAccept,
    }: {
        post: Post;
        community?: Community;
        isAccept: boolean;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            let postDocRef;
            if (community) {
                postDocRef = doc(
                    collection(
                        fireStore,
                        firebaseRoute.getCommunityPostRoute(community.id!)
                    ),
                    post.id
                );
                const communityDocRef = doc(
                    fireStore,
                    firebaseRoute.getAllCommunityRoute(),
                    community.id!
                );
                if (isAccept) {
                    batch.update(communityDocRef, {
                        numberOfPosts: increment(1),
                    });
                    // Community noti
                    await CommunityService.updateNotification({
                        community,
                        creatorDisplayName: post.creatorDisplayName!,
                        type: "POST",
                    });
                }
            } else {
                postDocRef = doc(
                    collection(
                        fireStore,
                        firebaseRoute.getUserPostRoute(post.creatorId)
                    ),
                    post.id
                );
            }
            if (isAccept) {
                batch.update(postDocRef, {
                    isAccept,
                });
            } else {
                batch.delete(postDocRef);
            }
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };

    static toggleLockState = async ({
        post,
        community,
    }: {
        post: Post;
        community?: Community;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            let postDocRef;
            if (community) {
                postDocRef = doc(
                    collection(
                        fireStore,
                        firebaseRoute.getCommunityPostRoute(community.id!)
                    ),
                    post.id
                );
            } else {
                postDocRef = doc(
                    collection(
                        fireStore,
                        firebaseRoute.getUserPostRoute(post.creatorId)
                    ),
                    post.id
                );
            }
            batch.update(postDocRef, {
                isLock: !post.isLock,
            });
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };

    static delete = async ({
        post,
        community,
    }: {
        post: Post;
        community?: Community;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            if (post.imageRefs && post.imageRefs.length > 0) {
                for (const imageRef of post.imageRefs) {
                    await deleteObject(ref(storage, imageRef));
                }
            }
            let postDocRef;
            let postCommentDocsRef;
            let rootDocRef;
            if (community) {
                postDocRef = doc(
                    fireStore,
                    firebaseRoute.getCommunityPostRoute(community.id!),
                    post.id!
                );
                postCommentDocsRef = collection(
                    fireStore,
                    firebaseRoute.getCommunityPostCommentRoute(
                        community.id!,
                        post.id!
                    )
                );
                rootDocRef = doc(
                    fireStore,
                    firebaseRoute.getAllCommunityRoute(),
                    community.id!
                );
            } else {
                postDocRef = doc(
                    fireStore,
                    firebaseRoute.getUserPostRoute(post.creatorId),
                    post.id!
                );
                postCommentDocsRef = collection(
                    fireStore,
                    firebaseRoute.getUserPostCommentRoute(
                        post.creatorId,
                        post.id!
                    )
                );
                rootDocRef = doc(
                    fireStore,
                    firebaseRoute.getAllUserRoute(),
                    post.creatorId
                );
            }
            const commentDocs = await getDocs(postCommentDocsRef);
            for (const commentDoc of commentDocs.docs) {
                const replyCommentDocsRef = collection(
                    fireStore,
                    `${commentDoc.ref.path}/comments`
                );
                const replyCommentDocs = await getDocs(replyCommentDocsRef);
                for (const replyCommentDoc of replyCommentDocs.docs) {
                    batch.delete(replyCommentDoc.ref);
                }
                batch.delete(commentDoc.ref);
            }
            const userPostVoteQuery = query(
                collectionGroup(fireStore, "postVotes"),
                where("id", "==", post.id!)
            );
            const userPostVoteDocs = await getDocs(userPostVoteQuery);
            for (const userPostVoteDoc of userPostVoteDocs.docs) {
                batch.delete(userPostVoteDoc.ref);
            }
            batch.delete(postDocRef);
            batch.update(rootDocRef, {
                numberOfPosts: increment(-1),
            });
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };

    static changePrivacy = async ({
        postId,
        privacy,
        userId,
    }: {
        postId: string;
        userId: string;
        privacy: PrivacyType;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            const postDocRef = doc(
                fireStore,
                firebaseRoute.getUserPostRoute(userId),
                postId
            );
            batch.update(postDocRef, {
                privacyType: privacy,
            });
            await batch.commit();
            return privacy;
        } catch (error) {
            console.log(error);
        }
    };
}

export default PostService;
