import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { Author, AuthorSnippet } from "@/models/Author";
import { Book, BookSnippet } from "@/models/Book";
import { Character, CharacterSnippet } from "@/models/Character";
import { Community } from "@/models/Community";
import { Genre, GenreSnippet } from "@/models/Genre";
import { Review } from "@/models/Review";
import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    where,
    orderBy,
} from "firebase/firestore";

let ModelUtils = {};

export default ModelUtils = {
    async getBook(bookId: string, userId?: string) {
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
    },
    async getBooks(searchValue: string) {
        const bookDocsRef = collection(
            fireStore,
            firebaseRoute.getAllBookRoute()
        );
        const queryConstraints = [];
        queryConstraints.push(where("name", ">=", searchValue));
        queryConstraints.push(where("name", "<=", searchValue + `\uf8ff`));
        queryConstraints.push(orderBy("name"));
        // queryConstraints.push(orderBy("createdAt"));
        const bookQuery = query(bookDocsRef, ...queryConstraints);
        const bookDocs = await getDocs(bookQuery);
        const books = bookDocs.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as Book)
        );
        return books;
    },
    async getReview(reviewId: string, userId?: string) {
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

                return {
                    review: reviewDoc.exists()
                        ? (JSON.parse(
                              JSON.stringify({
                                  id: reviewDoc.id,
                                  ...reviewDoc.data(),
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
    async getCommunity(communityId: string) {
        const communityDocRef = doc(
            fireStore,
            firebaseRoute.getAllCommunityRoute(),
            communityId
        );
        const communityDoc = await getDoc(communityDocRef);
        if (communityDoc.exists()) {
            const moderatorSnippetDocsRef = collection(
                fireStore,
                firebaseRoute.getCommunityModeratorSnippetRoute(communityDoc.id)
            );
            const moderatorSnippetDocs = await getDocs(moderatorSnippetDocsRef);
            const moderatorSnippets = moderatorSnippetDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            return JSON.parse(
                JSON.stringify({
                    id: communityDoc.id,
                    ...communityDoc.data(),
                    moderators: moderatorSnippets,
                })
            ) as Community;
        }
    },
    toGenreSnippet(genre: Genre): GenreSnippet {
        return {
            id: genre.id,
            name: genre.name,
        };
    },
    toAuthorSnippet(author: Author): AuthorSnippet {
        return {
            id: author.id,
            name: author.name,
            imageUrl: author.imageUrl,
        };
    },
    toCharacterSnippet(character: Character): CharacterSnippet {
        return {
            id: character.id,
            name: character.name,
            imageUrl: character.imageUrl,
            role: character.role,
            bio: character.bio,
        };
    },
    toBookSnippet(book: Book): BookSnippet {
        return {
            id: book.id,
            name: book.name,
            description: book.description,
            imageUrl: book.imageUrl,
            authorIds: book.authorIds,
            characterIds: book.characterIds,
            genreIds: book.genreIds,
        };
    },
};
