import { Book } from "@/models/Book";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

let bookUtils = {};

const fromDoc = (doc: QueryDocumentSnapshot<DocumentData>) => {
    const book = JSON.parse(JSON.stringify(doc.data())) as Book;
    return {
        id: doc.id,
        ...book,
    };
};

export default bookUtils = {
    fromDoc,
    fromDocs(docs: QueryDocumentSnapshot<DocumentData>[]) {
        return docs.map((doc) => fromDoc(doc));
    },
};
