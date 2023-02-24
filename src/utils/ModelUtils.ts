import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { Author } from "@/models/Author";
import { Book } from "@/models/Book";
import { Genre } from "@/models/Genre";
import { Review } from "@/models/Review";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

let ModelUtils = {};

type BookOptions = {
    getAuthor?: boolean;
    getGenre?: boolean;
};

type ReviewOptions = {
    getCreator?: boolean;
    getBook?: boolean;
};

export default ModelUtils = {
    async getBook(bookId: string, userId?: string, option?: BookOptions) {
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
                const bookAuthorIdDocRef = collection(
                    fireStore,
                    firebaseRoute.getBookAuthorIdRoute(bookId)
                );
                const bookGenreIdDocRef = collection(
                    fireStore,
                    firebaseRoute.getBookGenreIdRoute(bookId)
                );
                const characterSnippetsDocRef = collection(
                    fireStore,
                    firebaseRoute.getBookCharacterSnippetRoute(bookId)
                );
                const bookAuthorIdDocs = await getDocs(bookAuthorIdDocRef);
                const bookGenreIdDocs = await getDocs(bookGenreIdDocRef);
                const characterSnippetsDocs = await getDocs(
                    characterSnippetsDocRef
                );
                let authors: Author[] = [];
                let genres: Genre[] = [];
                if (option?.getAuthor) {
                    const authorDocRef = collection(
                        fireStore,
                        firebaseRoute.getAllAuthorRoute()
                    );
                    const authorDocs = await Promise.all(
                        bookAuthorIdDocs.docs.map((d) =>
                            getDoc(doc(authorDocRef, d.id))
                        )
                    );
                    authors = authorDocs
                        .filter((doc) => doc.exists())
                        .map(
                            (doc) =>
                                ({
                                    id: doc.id,
                                    ...doc.data(),
                                } as Author)
                        );
                }
                if (option?.getGenre) {
                    const genreDocRef = collection(
                        fireStore,
                        firebaseRoute.getAllGenreRoute()
                    );
                    const genreDocs = await Promise.all(
                        bookGenreIdDocs.docs.map((d) =>
                            getDoc(doc(genreDocRef, d.id))
                        )
                    );
                    genres = genreDocs
                        .filter((doc) => doc.exists())
                        .map(
                            (doc) =>
                                ({
                                    id: doc.id,
                                    ...doc.data(),
                                } as Genre)
                        );
                }

                return {
                    book: bookDoc.exists()
                        ? (JSON.parse(
                              JSON.stringify({
                                  id: bookDoc.id,
                                  ...bookDoc.data(),
                                  authorIds: bookAuthorIdDocs.docs.map(
                                      (doc) => doc.id
                                  ),
                                  authors,
                                  genres,
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
    },
    async getReview(reviewId: string, userId?: string, option?: ReviewOptions) {
        try {
            const reviewDocRef = doc(
                fireStore,
                firebaseRoute.getAllReviewRoute(),
                reviewId
            );
            const reviewDoc = await getDoc(reviewDocRef);
            if (reviewDoc.exists()) {
                if (userId) {
                    const reviewCreator = reviewDoc.data().creatorId;
                    if (reviewCreator !== userId) {
                        throw Error("Not creator");
                    }
                }

                let creatorDisplayName: string = "";
                let bookName: string = "";
                if (option?.getCreator) {
                    const reviewCreatorDocRef = doc(
                        fireStore,
                        firebaseRoute.getAllUserRoute(),
                        reviewDoc.data().creatorId!
                    );
                    const reviewCreatorDoc = await getDoc(reviewCreatorDocRef);
                    if (reviewCreatorDoc.exists()) {
                        creatorDisplayName =
                            reviewCreatorDoc.data().displayName;
                    }
                }
                if (option?.getBook) {
                    const reviewBookDocRef = doc(
                        fireStore,
                        firebaseRoute.getAllBookRoute(),
                        reviewDoc.data().bookId!
                    );
                    const reviewBookDoc = await getDoc(reviewBookDocRef);
                    if (reviewBookDoc.exists()) {
                        bookName = reviewBookDoc.data().name;
                    }
                }

                return {
                    review: reviewDoc.exists()
                        ? (JSON.parse(
                              JSON.stringify({
                                  id: reviewDoc.id,
                                  ...reviewDoc.data(),
                                  creatorDisplayName,
                                  bookName,
                              })
                          ) as Review)
                        : null,
                };
            }
            return;
        } catch (error) {
            console.log(error);
        }
    },
};
