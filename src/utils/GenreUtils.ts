import { Genre, GenreSnippet } from "@/models/Genre";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

let GenreUtils = {};

const toGenreSnippet = (genre: Genre): GenreSnippet => {
    return {
        id: genre.id,
        name: genre.name,
    };
};

const fromDoc = (
    doc: QueryDocumentSnapshot<DocumentData>,
    isSnippet = false
): Genre | GenreSnippet => {
    const genre = JSON.parse(
        JSON.stringify({
            id: doc.id,
            ...doc.data(),
        } as Genre)
    );
    return isSnippet ? toGenreSnippet(genre) : genre;
};

const fromDocs = (
    docs: QueryDocumentSnapshot<DocumentData>[],
    isSnippet = false
) => {
    return docs.map((doc) => fromDoc(doc, isSnippet));
};

export default GenreUtils = {
    fromDoc,
    fromDocs,
    toGenreSnippet,
};
