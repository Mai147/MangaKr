import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { Book, BookSnippet } from "@/models/Book";
import {
    doc,
    getDoc,
    collection,
    getDocs,
    QueryDocumentSnapshot,
    DocumentData,
} from "firebase/firestore";

let bookUtils = {};

const fromDoc = (doc: QueryDocumentSnapshot<DocumentData>) => {
    const book = JSON.parse(JSON.stringify(doc.data())) as Book;
    return {
        id: doc.id,
        ...book,
    };
};

export default bookUtils = {
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
                const authorSnippetsDocRef = collection(
                    fireStore,
                    firebaseRoute.getBookAuthorSnippetRoute(bookId)
                );
                const genreSnippetsDocRef = collection(
                    fireStore,
                    firebaseRoute.getBookGenreSnippetRoute(bookId)
                );
                const characterSnippetsDocRef = collection(
                    fireStore,
                    firebaseRoute.getBookCharacterSnippetRoute(bookId)
                );
                const authorSnippetsDocs = await getDocs(authorSnippetsDocRef);
                const genreSnippetsDocs = await getDocs(genreSnippetsDocRef);
                const characterSnippetsDocs = await getDocs(
                    characterSnippetsDocRef
                );

                return {
                    book: bookDoc.exists()
                        ? (JSON.parse(
                              JSON.stringify({
                                  id: bookDoc.id,
                                  ...bookDoc.data(),
                                  authorSnippets: authorSnippetsDocs.docs.map(
                                      (doc) => ({
                                          id: doc.id,
                                          ...doc.data(),
                                      })
                                  ),
                                  genreSnippets: genreSnippetsDocs.docs.map(
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
    fromDoc,
    fromDocs(docs: QueryDocumentSnapshot<DocumentData>[]) {
        return docs.map((doc) => fromDoc(doc));
    },
    toSnippet(book: Book): BookSnippet {
        return {
            id: book.id,
            name: book.name,
            imageUrl: book.imageUrl,
            authorIds: book.authorIds,
            description: book.description,
            genreIds: book.genreIds,
        };
    },
};
