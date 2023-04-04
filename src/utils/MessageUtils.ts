import { Message } from "@/models/Message";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

let MessageUtils;

const fromDoc = (doc: QueryDocumentSnapshot<DocumentData>): Message => {
    const message = JSON.parse(
        JSON.stringify({
            id: doc.id,
            ...doc.data(),
        } as Message)
    );
    return message;
};

const fromDocs = (docs: QueryDocumentSnapshot<DocumentData>[]) => {
    return docs.map((doc) => fromDoc(doc));
};

export default MessageUtils = {
    fromDoc,
    fromDocs,
};
