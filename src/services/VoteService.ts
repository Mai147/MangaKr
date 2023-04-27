import { fireStore } from "@/firebase/clientApp";
import { PostVote, postVoteList, Vote } from "@/models/Vote";
import { writeBatch, increment, getDoc, doc } from "firebase/firestore";

class VoteService {
    static get = async ({
        voteRoute,
        voteId,
    }: {
        voteRoute: string;
        voteId: string;
    }) => {
        const voteDocRef = doc(fireStore, voteRoute, voteId);
        const userVoteDoc = await getDoc(voteDocRef);
        if (userVoteDoc.exists()) {
            const vote = postVoteList.find(
                (item) => item.value === userVoteDoc.data().value
            );
            return vote;
        }
    };

    static create = async ({
        rootId,
        rootRoute,
        voteId,
        voteRoute,
        vote,
    }: {
        vote: Vote | PostVote;
        voteRoute: string;
        voteId: string;
        rootRoute: string;
        rootId: string;
    }) => {
        try {
            const { value } = vote;
            const voteDocRef = doc(fireStore, voteRoute, voteId);
            const rootDocRef = doc(fireStore, rootRoute, rootId);
            const batch = writeBatch(fireStore);
            batch.set(voteDocRef, {
                id: voteDocRef.id,
                value,
            });
            batch.update(rootDocRef, {
                [vote.field]: increment(1),
                numberOfReactions: increment(1),
            });
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };

    static update = async ({
        userVote,
        vote,
        rootId,
        rootRoute,
        voteId,
        voteRoute,
    }: {
        userVote: Vote | PostVote;
        vote: Vote | PostVote;
        voteRoute: string;
        voteId: string;
        rootRoute: string;
        rootId: string;
    }) => {
        try {
            const { value } = vote;
            const voteDocRef = doc(fireStore, voteRoute, voteId);
            const rootDocRef = doc(fireStore, rootRoute, rootId);
            const batch = writeBatch(fireStore);
            if (value === userVote.value) {
                batch.delete(voteDocRef);
            } else {
                batch.update(voteDocRef, {
                    value,
                });
            }
            const changing = value === userVote.value ? -2 : -1;
            batch.update(rootDocRef, {
                [vote.field]: increment(1),
                [userVote.field]: increment(changing),
                numberOfReactions: increment(changing + 1),
            });
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };
}

export default VoteService;
