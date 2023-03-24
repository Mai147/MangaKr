import { fireStore } from "@/firebase/clientApp";
import { PostVote, postVoteList, Vote } from "@/models/Vote";
import {
    DocumentData,
    writeBatch,
    increment,
    DocumentReference,
    CollectionReference,
    getDoc,
} from "firebase/firestore";

let VoteUtils = {};

const getUserVote = async ({
    voteDocRef,
}: {
    voteDocRef: DocumentReference<DocumentData>;
}) => {
    const userVoteDoc = await getDoc(voteDocRef);
    if (userVoteDoc.exists()) {
        const vote = postVoteList.find(
            (item) => item.value === userVoteDoc.data().value
        );
        return vote;
    }
};

const onVote = async ({
    userVote,
    vote,
    voteDocRef,
    rootDocRef,
}: {
    vote: Vote | PostVote;
    userVote: Vote | PostVote | undefined;
    voteDocRef: DocumentReference<DocumentData>;
    rootDocRef: DocumentReference<DocumentData>;
}) => {
    try {
        const { value } = vote;
        const batch = writeBatch(fireStore);
        if (!userVote) {
            batch.set(voteDocRef, {
                value,
            });
        } else {
            if (value === userVote.value) {
                batch.delete(voteDocRef);
            } else {
                batch.update(voteDocRef, {
                    value,
                });
            }
        }
        batch.update(rootDocRef, {
            [vote.field]: increment(1),
        });
        if (userVote) {
            const changing = value === userVote.value ? -2 : -1;
            batch.update(rootDocRef, {
                [userVote.field]: increment(changing),
            });
        }
        await batch.commit();
    } catch (error) {
        console.log(error);
    }
};

export default VoteUtils = {
    getUserVote,
    onVote,
};
