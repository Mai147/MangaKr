import { Review } from "@/models/Review";
import { DocumentData, QueryDocumentSnapshot } from "@firebase/firestore";

let ReviewUtils = {};

const fromDoc = (doc: QueryDocumentSnapshot<DocumentData>) => {
    const review = JSON.parse(
        JSON.stringify({
            id: doc.id,
            ...doc.data(),
        } as Review)
    );
    return review;
};

const fromDocs = (docs: QueryDocumentSnapshot<DocumentData>[]) => {
    return docs.map((doc) => fromDoc(doc));
};

export default ReviewUtils = {
    fromDoc,
    fromDocs,
};
