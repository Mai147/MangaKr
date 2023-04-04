import { Topic } from "@/models/Topic";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

const fromDoc = (doc: QueryDocumentSnapshot<DocumentData>) => {
    const topic = JSON.parse(JSON.stringify(doc.data())) as Topic;
    return {
        id: doc.id,
        ...topic,
    };
};

export const TopicUtils = {
    fromDoc,
};
