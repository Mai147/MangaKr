import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore, storage } from "@/firebase/clientApp";
import { Book, BookSnippet } from "@/models/Book";
import { Character } from "@/models/Character";
import BookUtils from "@/utils/BookUtils";
import FileUtils from "@/utils/FileUtils";
import {
    collection,
    doc,
    serverTimestamp,
    Timestamp,
    writeBatch,
    increment,
    getDocs,
    query,
    where,
    getDoc,
    WriteBatch,
    runTransaction,
    limit,
    orderBy,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import CharacterService from "./CharacterService";
import { ReadingBookSnippet } from "@/models/Book";
import { triGram } from "@/utils/StringUtils";

class BookService {
    static getAll = async ({
        bookOrderBy,
        bookLimit,
        bookOrderDirection = "desc",
    }: {
        bookLimit?: number;
        bookOrderBy?: string;
        bookOrderDirection?: "asc" | "desc";
    }) => {
        const bookDocsRef = collection(
            fireStore,
            firebaseRoute.getAllBookRoute()
        );
        const bookConstraints = [];
        if (bookLimit) {
            bookConstraints.push(limit(bookLimit));
        }
        if (bookOrderBy) {
            bookConstraints.push(orderBy(bookOrderBy, bookOrderDirection));
        }
        const bookQuery = query(bookDocsRef, ...bookConstraints);
        const bookDocs = await getDocs(bookQuery);
        const books = BookUtils.fromDocs(bookDocs.docs);
        return books;
    };

    static get = async ({
        bookId,
        userId,
    }: {
        bookId: string;
        userId?: string;
    }) => {
        try {
            const bookDocRef = doc(
                fireStore,
                firebaseRoute.getAllBookRoute(),
                bookId
            );
            const bookDoc = await getDoc(bookDocRef);
            if (bookDoc.exists()) {
                if (userId) {
                    const bookAuthor = bookDoc.data().writerId;
                    if (bookAuthor !== userId) {
                        return;
                    }
                }
                const bookAuthorSnippetDocRef = collection(
                    fireStore,
                    firebaseRoute.getBookAuthorSnippetsRoute(bookId)
                );
                const bookGenreSnippetDocRef = collection(
                    fireStore,
                    firebaseRoute.getBookGenreSnippetsRoute(bookId)
                );
                const characterSnippetsDocRef = collection(
                    fireStore,
                    firebaseRoute.getBookCharacterSnippetRoute(bookId)
                );
                const bookAuthorSnippetsDocs = await getDocs(
                    bookAuthorSnippetDocRef
                );
                const bookGenreSnippetsDocs = await getDocs(
                    bookGenreSnippetDocRef
                );
                const characterSnippetsDocs = await getDocs(
                    characterSnippetsDocRef
                );

                return {
                    book: bookDoc.exists()
                        ? (JSON.parse(
                              JSON.stringify({
                                  id: bookDoc.id,
                                  ...bookDoc.data(),
                                  authorSnippets:
                                      bookAuthorSnippetsDocs.docs.map(
                                          (doc) => ({
                                              id: doc.id,
                                              ...doc.data(),
                                          })
                                      ),
                                  genreSnippets: bookGenreSnippetsDocs.docs.map(
                                      (doc) => ({
                                          id: doc.id,
                                          ...doc.data(),
                                      })
                                  ),
                                  characterSnippets:
                                      characterSnippetsDocs.docs.map((doc) => ({
                                          id: doc.id,
                                          ...doc.data(),
                                      })),
                              })
                          ) as Book)
                        : null,
                };
            }
            return;
        } catch (error) {
            console.log(error);
        }
    };

    static create = async ({
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
            const downloadUrl = await FileUtils.uploadFile({
                imageRoute: firebaseRoute.getBookImageRoute(bookDocRef.id),
                imageUrl: bookForm.imageUrl,
            });
            let characterIds: string[] = [];
            // Create character
            for (const char of characters) {
                const charId = await CharacterService.create({
                    character: char,
                    bookId: bookDocRef.id,
                });
                if (charId) {
                    characterIds.push(charId);
                }
            }

            // Create book
            const {
                authorSnippets,
                genreSnippets,
                characterSnippets,
                ...newBook
            } = {
                ...bookForm,
                characterIds,
            };
            const trigramName = triGram(newBook.name);
            batch.set(bookDocRef, {
                ...newBook,
                trigramName: trigramName.obj,
                writerId: userId,
                createdAt: serverTimestamp() as Timestamp,
            });
            // Create Snippet
            const authorRoute = firebaseRoute.getAllAuthorRoute();
            const genreRoute = firebaseRoute.getAllGenreRoute();
            const bookAuthorSnippetRoute =
                firebaseRoute.getBookAuthorSnippetsRoute(bookDocRef.id);
            const bookGenreSnippetRoute =
                firebaseRoute.getBookGenreSnippetsRoute(bookDocRef.id);
            bookForm.authorSnippets?.forEach((author) => {
                BookService.updateSnippet({
                    batch,
                    id: author.id!,
                    snippetRef: bookAuthorSnippetRoute,
                    ref: authorRoute,
                    type: "create",
                    value: author,
                });
            });
            bookForm.genreSnippets?.forEach((genre) => {
                BookService.updateSnippet({
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
                ...BookUtils.toBookSnippet(bookForm),
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

    static update = async ({
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
                downloadUrl = await FileUtils.uploadFile({
                    imageRoute: firebaseRoute.getBookImageRoute(bookDocRef.id),
                    imageUrl: bookForm.imageUrl,
                });
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
            const trigramName = triGram(updateBook.name);
            batch.update(bookDocRef, {
                ...updateBook,
                trigramName: trigramName.obj,
            });
            // Update Snippet
            const authorRoute = firebaseRoute.getAllAuthorRoute();
            const bookAuthorSnippetsRoute =
                firebaseRoute.getBookAuthorSnippetsRoute(book?.id!);
            const genreRoute = firebaseRoute.getAllGenreRoute();
            const bookGenreSnippetsRoute =
                firebaseRoute.getBookGenreSnippetsRoute(book?.id!);
            const removedAndInsertedSnippet =
                BookUtils.findRemovedAndInsertedSnippet(
                    book,
                    bookForm,
                    characters
                );
            removedAndInsertedSnippet.authors.removed.forEach((id) => {
                BookService.updateSnippet({
                    batch,
                    id,
                    snippetRef: bookAuthorSnippetsRoute,
                    ref: authorRoute,
                    type: "delete",
                });
            });
            removedAndInsertedSnippet.genres.removed.forEach((id) => {
                BookService.updateSnippet({
                    batch,
                    id,
                    snippetRef: bookGenreSnippetsRoute,
                    ref: genreRoute,
                    type: "delete",
                });
            });
            removedAndInsertedSnippet.authors.inserted.forEach((author) => {
                BookService.updateSnippet({
                    batch,
                    id: author.id!,
                    snippetRef: bookAuthorSnippetsRoute,
                    ref: authorRoute,
                    type: "create",
                    value: author,
                });
            });
            removedAndInsertedSnippet.genres.inserted.forEach((genre) => {
                BookService.updateSnippet({
                    batch,
                    id: genre.id!,
                    snippetRef: bookGenreSnippetsRoute,
                    ref: genreRoute,
                    type: "create",
                    value: genre,
                });
            });
            let characterIds: string[] = [];
            for (const charId of removedAndInsertedSnippet.characters.removed) {
                await CharacterService.delete({ id: charId, bookId: book.id! });
            }
            for (const char of removedAndInsertedSnippet.characters.inserted) {
                const charId = await CharacterService.create({
                    character: char,
                    bookId: book.id!,
                });
                if (charId) {
                    characterIds.push(charId);
                }
            }
            for (const char of removedAndInsertedSnippet.characters.updated) {
                const oldChar = book.characterSnippets?.find(
                    (ch) => ch.id === char.id!
                );
                const charId = await CharacterService.update({
                    character: char,
                    oldCharacter: oldChar as Character,
                    bookId: book.id!,
                });
                if (charId) {
                    characterIds.push(charId);
                }
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
                ...BookUtils.toBookSnippet(bookForm),
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

    static delete = async ({ book }: { book: Book | BookSnippet }) => {
        try {
            const batch = writeBatch(fireStore);
            // Delete Book image
            if (book.imageUrl) {
                const imageRef = ref(
                    storage,
                    firebaseRoute.getBookImageRoute(book.id!)
                );
                await deleteObject(imageRef);
            }
            // Decrease author and genre number
            book.authorIds?.forEach((id) => {
                const authorRef = doc(
                    fireStore,
                    firebaseRoute.getAllAuthorRoute(),
                    id
                );
                batch.update(authorRef, {
                    numberOfBooks: increment(-1),
                });
            });
            book.genreIds?.forEach((id) => {
                const genreRef = doc(
                    fireStore,
                    firebaseRoute.getAllGenreRoute(),
                    id
                );
                batch.update(genreRef, {
                    numberOfBooks: increment(-1),
                });
            });

            // Delete character
            if (book.characterIds) {
                for (const id of book.characterIds) {
                    const characterDocRef = doc(
                        fireStore,
                        firebaseRoute.getAllCharacterRoute(),
                        id!
                    );
                    const imageRef = ref(
                        storage,
                        firebaseRoute.getCharacterImageRoute(id!)
                    );
                    await deleteObject(imageRef);
                    batch.delete(characterDocRef);
                }
            }

            // Delete author, genre, character sub collection
            const bookAuthorDocsRef = collection(
                fireStore,
                firebaseRoute.getBookAuthorSnippetsRoute(book.id!)
            );
            const bookAuthorDocs = await getDocs(bookAuthorDocsRef);
            bookAuthorDocs.docs.forEach((d) => {
                batch.delete(doc(bookAuthorDocsRef, d.id));
            });
            const bookGenreDocsRef = collection(
                fireStore,
                firebaseRoute.getBookGenreSnippetsRoute(book.id!)
            );
            const bookGenreDocs = await getDocs(bookGenreDocsRef);
            bookGenreDocs.docs.forEach((d) => {
                batch.delete(doc(bookGenreDocsRef, d.id));
            });
            const bookCharacterDocsRef = collection(
                fireStore,
                firebaseRoute.getBookCharacterSnippetRoute(book.id!)
            );
            const bookCharacterDocs = await getDocs(bookCharacterDocsRef);
            bookCharacterDocs.forEach((d) => {
                batch.delete(doc(bookCharacterDocsRef, d.id));
            });
            const bookCommentsDocsRef = collection(
                fireStore,
                firebaseRoute.getBookCommentRoute(book.id!)
            );
            const bookCommentsDocs = await getDocs(bookCommentsDocsRef);
            bookCommentsDocs.forEach((d) => {
                batch.delete(doc(bookCommentsDocsRef, d.id));
            });

            // Delete Book
            const bookRef = doc(
                fireStore,
                firebaseRoute.getAllBookRoute(),
                book.id!
            );
            batch.delete(bookRef);

            // Delete BookSnippet in user
            const userBookRef = doc(
                fireStore,
                firebaseRoute.getUserWritingBookSnippetRoute(book.writerId),
                book.id!
            );
            batch.delete(userBookRef);
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };

    static getUserSnippetBook = async ({
        type,
        userId,
    }: {
        userId: string;
        type: "writing" | "reading";
    }) => {
        const bookSnippetDocsRef = collection(
            fireStore,
            type === "writing"
                ? firebaseRoute.getUserWritingBookSnippetRoute(userId)
                : firebaseRoute.getUserReadingBookSnippetRoute(userId)
        );
        const bookSnippetDocs = await getDocs(bookSnippetDocsRef);
        const bookSnippets = bookSnippetDocs.docs.map(
            (doc) =>
                ({
                    ...doc.data(),
                    id: doc.id,
                } as BookSnippet)
        );
        return bookSnippets;
    };

    private static updateSnippet = async ({
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

    static deleteReadingSnippet = async ({
        book,
        userId,
    }: {
        book: Book | BookSnippet;
        userId: string;
    }) => {
        const batch = writeBatch(fireStore);
        const bookDocRef = doc(
            collection(fireStore, firebaseRoute.getAllBookRoute()),
            book.id
        );
        const userReadingDocRef = doc(
            collection(
                fireStore,
                firebaseRoute.getUserReadingBookSnippetRoute(userId)
            ),
            book.id
        );
        batch.delete(userReadingDocRef);
        const bookDoc = await getDoc(bookDocRef);
        if (bookDoc.exists()) {
            batch.update(bookDocRef, {
                popularity: increment(-1),
            });
        }
        await batch.commit();
    };

    static getUserRate = async ({
        userId,
        bookId,
    }: {
        userId: string;
        bookId: string;
    }) => {
        try {
            const bookRateDocRef = doc(
                collection(
                    fireStore,
                    firebaseRoute.getUserBookVoteRoute(userId)
                ),
                bookId
            );
            const bookRateDoc = await getDoc(bookRateDocRef);
            if (bookRateDoc.exists()) {
                return bookRateDoc.data().value as number;
            }
        } catch (error) {
            console.log(error);
        }
    };

    static handleRate = async ({
        userId,
        bookId,
        value,
        userRate,
    }: {
        userId: string;
        bookId: string;
        value: number;
        userRate: number;
    }) => {
        try {
            await runTransaction(fireStore, async (transaction) => {
                const bookVoteDocRef = doc(
                    collection(
                        fireStore,
                        firebaseRoute.getUserBookVoteRoute(userId)
                    ),
                    bookId
                );
                const bookDocRef = doc(
                    collection(fireStore, firebaseRoute.getAllBookRoute()),
                    bookId
                );
                const bookDoc = await transaction.get(bookDocRef);
                if (!bookDoc.exists()) {
                    throw "Không tìm thấy sách";
                }
                const { rating, numberOfRates } = bookDoc.data();
                let newRating = 0;
                if (userRate !== 0) {
                    newRating =
                        (rating * numberOfRates + value - userRate) /
                        numberOfRates;
                    transaction.update(bookVoteDocRef, {
                        value,
                    });
                } else {
                    newRating =
                        (rating * numberOfRates + value) / (numberOfRates + 1);
                    transaction.set(bookVoteDocRef, {
                        value,
                    });
                    transaction.update(bookDocRef, {
                        numberOfRates: increment(1),
                    });
                }
                transaction.update(bookDocRef, {
                    rating: newRating,
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

    static isInLibrary = async ({
        bookId,
        userId,
    }: {
        userId: string;
        bookId: string;
    }) => {
        const readingBookDocRef = doc(
            collection(
                fireStore,
                firebaseRoute.getUserReadingBookSnippetRoute(userId)
            ),
            bookId
        );
        const bookDoc = await getDoc(readingBookDocRef);
        if (bookDoc.exists()) {
            return true;
        } else {
            return false;
        }
    };

    static addToLibrary = async ({
        readingBookSnippetForm,
        userId,
    }: {
        readingBookSnippetForm: ReadingBookSnippet;
        userId: string;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            const userReadingBookDocRef = doc(
                collection(
                    fireStore,
                    firebaseRoute.getUserReadingBookSnippetRoute(userId)
                ),
                readingBookSnippetForm.id
            );
            const bookDocRef = doc(
                collection(fireStore, firebaseRoute.getAllBookRoute()),
                readingBookSnippetForm.id
            );
            batch.set(userReadingBookDocRef, readingBookSnippetForm);
            batch.update(bookDocRef, {
                popularity: increment(1),
            });
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };

    static removeOutLibrary = async ({
        bookId,
        userId,
    }: {
        userId: string;
        bookId: string;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            const userReadingBookDocRef = doc(
                collection(
                    fireStore,
                    firebaseRoute.getUserReadingBookSnippetRoute(userId)
                ),
                bookId
            );
            const bookDocRef = doc(
                collection(fireStore, firebaseRoute.getAllBookRoute()),
                bookId
            );
            batch.delete(userReadingBookDocRef);
            batch.update(bookDocRef, {
                popularity: increment(-1),
            });
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };
}

export default BookService;
