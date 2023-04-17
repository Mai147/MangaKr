import { Voting } from "@/models/Vote";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

const fromDoc = (doc: QueryDocumentSnapshot<DocumentData>) => {
    const voting = JSON.parse(JSON.stringify(doc.data())) as Voting;
    return {
        id: doc.id,
        ...voting,
    };
};
export const VotingUtils = {
    fromDoc,
};
