import { Author, AuthorSnippet } from "@/models/Author";
import { DocumentData, QueryDocumentSnapshot } from "@firebase/firestore";

let AuthorUtils = {};

const toAuthorSnippet = (author: Author): AuthorSnippet => {
    return {
        id: author.id,
        name: author.name,
        imageUrl: author.imageUrl,
    };
};

const fromDoc = (
    doc: QueryDocumentSnapshot<DocumentData>,
    isSnippet = false
): Author | AuthorSnippet => {
    const author = JSON.parse(
        JSON.stringify({
            id: doc.id,
            ...doc.data(),
        } as Author)
    );
    return isSnippet ? toAuthorSnippet(author) : author;
};

const fromDocs = (
    docs: QueryDocumentSnapshot<DocumentData>[],
    isSnippet = false
) => {
    return docs.map((doc) => fromDoc(doc, isSnippet));
};

export default AuthorUtils = {
    fromDoc,
    fromDocs,
    toAuthorSnippet,
};
