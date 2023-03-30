import { AuthorSnippet } from "@/models/Author";
import { Book, BookSnippet } from "@/models/Book";
import { Character } from "@/models/Character";
import { GenreSnippet } from "@/models/Genre";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

let BookUtils = {};

type RemovedAndInsertedSnippet = {
    authors: {
        removed: string[];
        inserted: AuthorSnippet[];
    };
    genres: {
        removed: string[];
        inserted: GenreSnippet[];
    };
    characters: {
        removed: string[];
        inserted: Character[];
        updated: Character[];
    };
};

const fromDoc = (doc: QueryDocumentSnapshot<DocumentData>) => {
    const book = JSON.parse(JSON.stringify(doc.data())) as Book;
    return {
        id: doc.id,
        ...book,
    };
};

const toBookSnippet = (book: Book): BookSnippet => {
    return {
        id: book.id,
        name: book.name,
        description: book.description,
        imageUrl: book.imageUrl,
        authorIds: book.authorIds,
        characterIds: book.characterIds,
        genreIds: book.genreIds,
        writerId: book.writerId,
    };
};

const findRemovedAndInsertedSnippet = (
    oldBook: Book,
    newBook: Book,
    characters: Character[]
): RemovedAndInsertedSnippet => {
    let removedAuthor: string[] = [];
    let insertedAuthor: AuthorSnippet[] = [];
    let removedGenre: string[] = [];
    let insertedGenre: GenreSnippet[] = [];
    let removedCharacter: string[] = [];
    let insertedCharacter: Character[] = [];
    let updatedCharacter: Character[] = [];
    if (oldBook.authorSnippets) {
        removedAuthor = oldBook?.authorSnippets
            .filter(
                (author) =>
                    !newBook.authorSnippets
                        ?.map((au) => au.id)
                        .includes(author.id!)
            )
            .map((au) => au.id!);
    }
    if (newBook.authorSnippets) {
        insertedAuthor = newBook.authorSnippets.filter(
            (author) =>
                !oldBook.authorSnippets?.map((au) => au.id).includes(author.id!)
        );
    }
    if (oldBook?.genreSnippets) {
        removedGenre = oldBook?.genreSnippets
            .filter(
                (genre) =>
                    !newBook.genreSnippets
                        ?.map((genre) => genre.id)
                        .includes(genre.id!)
            )
            .map((genre) => genre.id!);
    }
    if (newBook.genreSnippets) {
        insertedGenre = newBook.genreSnippets.filter(
            (genre) =>
                !oldBook.genreSnippets?.map((gen) => gen.id).includes(genre.id!)
        );
    }
    if (oldBook?.characterSnippets) {
        removedCharacter = oldBook.characterSnippets
            .filter(
                (char) =>
                    !newBook.characterSnippets
                        ?.map((ch) => ch.id)
                        .includes(char.id)
            )
            .map((char) => char.id!);
    }
    if (characters) {
        insertedCharacter = characters.filter(
            (char) =>
                !oldBook.characterSnippets
                    ?.map((ch) => ch.id)
                    .includes(char.id!)
        );
        if (oldBook.characterSnippets) {
            updatedCharacter = characters.filter((char) =>
                newBook.characterSnippets?.map((ch) => ch.id).includes(char.id)
            );
        }
    }

    return {
        authors: {
            removed: removedAuthor,
            inserted: insertedAuthor,
        },
        genres: {
            removed: removedGenre,
            inserted: insertedGenre,
        },
        characters: {
            removed: removedCharacter,
            inserted: insertedCharacter,
            updated: updatedCharacter,
        },
    };
};

export default BookUtils = {
    fromDoc,
    fromDocs(docs: QueryDocumentSnapshot<DocumentData>[]) {
        return docs.map((doc) => fromDoc(doc));
    },
    findRemovedAndInsertedSnippet,
    toBookSnippet,
};
