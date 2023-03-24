import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore, storage } from "@/firebase/clientApp";
import { AuthorSnippet } from "@/models/Author";
import { Book } from "@/models/Book";
import { Character } from "@/models/Character";
import { GenreSnippet } from "@/models/Genre";
import {
    QueryDocumentSnapshot,
    DocumentData,
    collection,
    doc,
    serverTimestamp,
    Timestamp,
    writeBatch,
    WriteBatch,
    increment,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import {
    ref,
    uploadString,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";
import ModelUtils from "./ModelUtils";

let bookUtils = {};

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

const updateSnippet = async ({
    batch,
    snippetRef,
    id,
    type,
    ref,
    value,
}: {
    batch: WriteBatch;
    snippetRef: string;
    ref: string;
    id: string;
    type: "create" | "delete";
    value?: any;
}) => {
    const snippetDocRef = doc(fireStore, snippetRef, id);
    switch (type) {
        case "delete":
            batch.delete(snippetDocRef);
            break;
        case "create":
            batch.set(snippetDocRef, value);
    }
    // Update number of books
    const docRef = doc(fireStore, ref, id);
    batch.update(docRef, {
        numberOfBooks: increment(type === "create" ? 1 : -1),
    });
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

const onCreate = async ({
    bookForm,
    characters,
    userId,
}: {
    userId: string;
    bookForm: Book;
    characters: Character[];
}) => {
    try {
        const batch = writeBatch(fireStore);
        const bookDocRef = doc(
            collection(fireStore, firebaseRoute.getAllBookRoute())
        );
        let downloadUrl = undefined;
        if (bookForm.imageUrl) {
            const imageRef = ref(
                storage,
                firebaseRoute.getBookImageRoute(bookDocRef.id)
            );
            await uploadString(imageRef, bookForm.imageUrl, "data_url");
            downloadUrl = await getDownloadURL(imageRef);
        }
        let characterIds: string[] = [];
        // Create character
        for (const char of characters) {
            // Upload image
            const characterDocRef = doc(
                collection(fireStore, firebaseRoute.getAllCharacterRoute())
            );
            let charImage;
            if (char.imageUrl) {
                const imageRef = ref(
                    storage,
                    firebaseRoute.getCharacterImageRoute(characterDocRef.id)
                );
                await uploadString(imageRef, char.imageUrl, "data_url");
                charImage = await getDownloadURL(imageRef);
            }

            const { id, ...info } = char;
            characterIds = [...characterIds, characterDocRef.id];
            batch.set(characterDocRef, {
                ...info,
                id: characterDocRef.id,
                bookId: bookDocRef.id,
                imageUrl: charImage,
            });
            const characterSnippetRef = doc(
                collection(
                    fireStore,
                    firebaseRoute.getBookCharacterSnippetRoute(bookDocRef.id)
                ),
                characterDocRef.id
            );
            batch.set(characterSnippetRef, {
                ...ModelUtils.toCharacterSnippet(char),
                id: characterDocRef.id,
                imageUrl: charImage,
            });
        }

        // Create book
        const { authorSnippets, genreSnippets, characterSnippets, ...newBook } =
            {
                ...bookForm,
                characterIds,
            };
        const nameLowerCase = newBook.name.toLowerCase();
        batch.set(bookDocRef, {
            ...newBook,
            nameLowerCase,
            writerId: userId,
            createdAt: serverTimestamp() as Timestamp,
        });
        // Create Snippet
        const authorRoute = firebaseRoute.getAllAuthorRoute();
        const genreRoute = firebaseRoute.getAllGenreRoute();
        const bookAuthorSnippetRoute = firebaseRoute.getBookAuthorSnippetsRoute(
            bookDocRef.id
        );
        const bookGenreSnippetRoute = firebaseRoute.getBookGenreSnippetsRoute(
            bookDocRef.id
        );
        bookForm.authorSnippets?.forEach((author) => {
            updateSnippet({
                batch,
                id: author.id!,
                snippetRef: bookAuthorSnippetRoute,
                ref: authorRoute,
                type: "create",
                value: author,
            });
        });
        bookForm.genreSnippets?.forEach((genre) => {
            updateSnippet({
                batch,
                id: genre.id!,
                snippetRef: bookGenreSnippetRoute,
                ref: genreRoute,
                type: "create",
                value: genre,
            });
        });

        // Create user book writing Snippet
        const userWritingBookDocRef = doc(
            fireStore,
            firebaseRoute.getUserWritingBookSnippetRoute(userId),
            bookDocRef.id
        );
        batch.set(userWritingBookDocRef, {
            ...ModelUtils.toBookSnippet(bookForm),
            id: bookDocRef.id,
        });

        // Update image
        batch.update(
            doc(fireStore, firebaseRoute.getAllBookRoute(), bookDocRef.id),
            {
                imageUrl: downloadUrl,
            }
        );
        await batch.commit();
    } catch (error) {
        console.log(error);
    }
};

const onUpdate = async ({
    book,
    bookForm,
    userId,
    characters,
}: {
    userId: string;
    book: Book;
    bookForm: Book;
    characters: Character[];
}) => {
    try {
        const batch = writeBatch(fireStore);
        const bookDocRef = doc(
            fireStore,
            firebaseRoute.getAllBookRoute(),
            book.id!
        );
        let downloadUrl;
        if (bookForm.imageUrl && bookForm.imageUrl !== book.imageUrl) {
            const imageRef = ref(
                storage,
                firebaseRoute.getBookImageRoute(bookDocRef.id)
            );
            await uploadString(imageRef, bookForm.imageUrl, "data_url");
            downloadUrl = await getDownloadURL(imageRef);
        }
        // Update book
        const {
            authorSnippets,
            genreSnippets,
            characterSnippets,
            ...updateBook
        } = {
            ...bookForm,
        };
        const nameLowerCase = updateBook.name.toLowerCase();
        batch.update(bookDocRef, {
            ...updateBook,
            nameLowerCase,
        });
        // Update Snippet
        const authorRoute = firebaseRoute.getAllAuthorRoute();
        const bookAuthorSnippetsRoute =
            firebaseRoute.getBookAuthorSnippetsRoute(book?.id!);
        const genreRoute = firebaseRoute.getAllGenreRoute();
        const bookGenreSnippetsRoute = firebaseRoute.getBookGenreSnippetsRoute(
            book?.id!
        );
        const removedAndInsertedSnippet = findRemovedAndInsertedSnippet(
            book,
            bookForm,
            characters
        );
        removedAndInsertedSnippet.authors.removed.forEach((id) => {
            updateSnippet({
                batch,
                id,
                snippetRef: bookAuthorSnippetsRoute,
                ref: authorRoute,
                type: "delete",
            });
        });
        removedAndInsertedSnippet.genres.removed.forEach((id) => {
            updateSnippet({
                batch,
                id,
                snippetRef: bookGenreSnippetsRoute,
                ref: genreRoute,
                type: "delete",
            });
        });
        removedAndInsertedSnippet.authors.inserted.forEach((author) => {
            updateSnippet({
                batch,
                id: author.id!,
                snippetRef: bookAuthorSnippetsRoute,
                ref: authorRoute,
                type: "create",
                value: author,
            });
        });
        removedAndInsertedSnippet.genres.inserted.forEach((genre) => {
            updateSnippet({
                batch,
                id: genre.id!,
                snippetRef: bookGenreSnippetsRoute,
                ref: genreRoute,
                type: "create",
                value: genre,
            });
        });
        let characterIds: string[] = [];
        for (const char of removedAndInsertedSnippet.characters.removed) {
            // Delete image
            const imageRef = ref(
                storage,
                firebaseRoute.getCharacterImageRoute(char)
            );
            await deleteObject(imageRef);
            // Delete character
            const characterDocRef = doc(
                fireStore,
                firebaseRoute.getAllCharacterRoute(),
                char
            );
            batch.delete(characterDocRef);
            // Delete Book Character snippet
            const bookCharacterSnippetDocRef = doc(
                fireStore,
                firebaseRoute.getBookCharacterSnippetRoute(book.id!),
                char
            );
            batch.delete(bookCharacterSnippetDocRef);
        }
        for (const char of removedAndInsertedSnippet.characters.inserted) {
            const characterDocRef = doc(
                fireStore,
                firebaseRoute.getAllCharacterRoute(),
                char.id!
            );
            const { id, ...info } = char;
            characterIds = [...characterIds, characterDocRef.id];
            // Insert image
            let charImage;
            if (char.imageUrl) {
                const imageRef = ref(
                    storage,
                    firebaseRoute.getCharacterImageRoute(characterDocRef.id)
                );
                await uploadString(imageRef, char.imageUrl, "data_url");
                charImage = await getDownloadURL(imageRef);
            }
            // Insert character
            batch.set(characterDocRef, { ...info, id: characterDocRef.id });
            // Insert snippet
            const characterSnippetDocRef = doc(
                fireStore,
                firebaseRoute.getBookCharacterSnippetRoute(book.id!),
                char.id!
            );
            batch.set(characterSnippetDocRef, {
                ...ModelUtils.toCharacterSnippet(info),
                id: characterDocRef.id,
            });
        }
        for (const char of removedAndInsertedSnippet.characters.updated) {
            // Change image
            let charImage;
            const oldChar = book.characterSnippets?.find(
                (ch) => ch.id === char.id!
            );
            characterIds = [...characterIds, char.id!];
            if (char.imageUrl !== oldChar?.imageUrl) {
                const imageRef = ref(
                    storage,
                    firebaseRoute.getCharacterImageRoute(char.id!)
                );
                if (char.imageUrl) {
                    await uploadString(imageRef, char.imageUrl, "data_url");
                    charImage = await getDownloadURL(imageRef);
                } else {
                    await deleteObject(imageRef);
                }
            }
            // Update character
            const characterDocRef = doc(
                fireStore,
                firebaseRoute.getAllCharacterRoute(),
                char.id!
            );
            batch.update(characterDocRef, { ...char });
            // Insert snippet
            const characterSnippetDocRef = doc(
                fireStore,
                firebaseRoute.getBookCharacterSnippetRoute(book.id!),
                char.id!
            );
            batch.update(characterSnippetDocRef, {
                ...ModelUtils.toCharacterSnippet(char),
            });
        }

        batch.update(bookDocRef, {
            characterIds,
        });

        // Update user writing snippet
        const userWritingDocRef = doc(
            fireStore,
            firebaseRoute.getUserWritingBookSnippetRoute(userId),
            book.id!
        );
        batch.update(userWritingDocRef, {
            ...ModelUtils.toBookSnippet(bookForm),
            imageUrl: downloadUrl,
        });

        // Update bookName in reviews and communities
        const reviewDocsRef = collection(
            fireStore,
            firebaseRoute.getAllReviewRoute()
        );
        const reviewQuery = query(
            reviewDocsRef,
            where("bookId", "==", book.id)
        );
        const reviewDocs = await getDocs(reviewQuery);
        reviewDocs.docs.forEach((doc) => {
            if (doc.exists()) {
                batch.update(doc.ref, {
                    bookName: bookForm.name,
                });
            }
        });

        const communityDocsRef = collection(
            fireStore,
            firebaseRoute.getAllCommunityRoute()
        );
        const commnunityQuery = query(
            communityDocsRef,
            where("bookId", "==", book.id)
        );
        const communityDocs = await getDocs(commnunityQuery);
        communityDocs.docs.forEach((doc) => {
            if (doc.exists()) {
                batch.update(doc.ref, {
                    bookName: bookForm.name,
                });
            }
        });

        // Update image
        batch.update(bookDocRef, {
            imageUrl: downloadUrl,
        });
        if (book.imageUrl && !bookForm.imageUrl) {
            const imageRef = ref(
                storage,
                firebaseRoute.getBookImageRoute(book.id!)
            );
            await deleteObject(imageRef);
        }

        await batch.commit();
    } catch (error) {
        console.log(error);
    }
};

export default bookUtils = {
    fromDoc,
    fromDocs(docs: QueryDocumentSnapshot<DocumentData>[]) {
        return docs.map((doc) => fromDoc(doc));
    },
    onCreate,
    onUpdate,
};
