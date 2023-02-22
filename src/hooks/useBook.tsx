import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { Book, BookSnippet } from "@/models/Book";
import { BookComment } from "@/models/Comment";
import { UserModel } from "@/models/User";
import {
    runTransaction,
    doc,
    collection,
    increment,
    getDocs,
    query,
    orderBy,
    limit,
    QueryDocumentSnapshot,
    DocumentData,
    startAfter,
    getCountFromServer,
    endBefore,
    limitToLast,
    where,
    writeBatch,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";
import { useState } from "react";

const useBook = () => {
    // const [voteLoading, setVoteLoading] = useState(false);
    // const [commentLoading, setCommentLoading] = useState(false);
    // const [addToLibraryLoading, setAddToLibraryLoading] = useState(false);
    const [firstBookDoc, setFirstBookDocs] =
        useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [lastBookDoc, setLastBookDoc] =
        useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    // const [lastCommentDoc, setLastCommentDoc] =
    //     useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const getBooks = async ({
        page,
        pageCount,
        isNext,
        genreId,
    }: {
        page: number;
        pageCount: number;
        isNext: boolean;
        genreId?: string;
    }) => {
        const bookDocsRef = collection(
            fireStore,
            firebaseRoute.getAllBookRoute()
        );
        const queryConstraints = [];
        if (genreId) {
            queryConstraints.push(where("genreIds", "array-contains", genreId));
        }
        const snapShot = await getCountFromServer(
            query(bookDocsRef, ...queryConstraints)
        );
        const totalPage = Math.ceil(snapShot.data().count / pageCount);
        if (isNext) {
            if (lastBookDoc) {
                if (page <= totalPage) {
                    queryConstraints.push(startAfter(lastBookDoc));
                    queryConstraints.push(limit(pageCount));
                } else return;
            }
        } else {
            if (page >= 1) {
                queryConstraints.push(endBefore(firstBookDoc));
                queryConstraints.push(limitToLast(pageCount));
            } else return;
        }
        const bookQuery = query(
            bookDocsRef,
            orderBy("createdAt"),
            limit(pageCount),
            ...queryConstraints
        );
        const bookDocs = await getDocs(bookQuery);
        const books = bookDocs.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as Book)
        );
        setFirstBookDocs(bookDocs.docs[0]);
        setLastBookDoc(bookDocs.docs[bookDocs.docs.length - 1]);
        return {
            books,
            totalPage,
        };
    };
    // const getComments = async ({
    //     page,
    //     pageCount,
    //     bookId,
    // }: {
    //     page: number;
    //     pageCount: number;
    //     bookId: string;
    // }) => {
    //     const commentDocsRef = collection(
    //         fireStore,
    //         firebaseRoute.getAllCommentRoute()
    //     );
    //     const queryConstraints = [];
    //     const snapShot = await getCountFromServer(query(commentDocsRef));
    //     const totalPage = Math.ceil(snapShot.data().count / pageCount);
    //     if (lastBookDoc) {
    //         if (page <= totalPage) {
    //             queryConstraints.push(startAfter(lastCommentDoc));
    //             queryConstraints.push(limit(pageCount));
    //         } else return;
    //     }
    //     const commentQuery = query(
    //         commentDocsRef,
    //         where("bookId", "==", bookId),
    //         orderBy("createdAt", "desc"),
    //         limit(pageCount),
    //         ...queryConstraints
    //     );
    //     const commentDocs = await getDocs(commentQuery);
    //     const comments = commentDocs.docs.map(
    //         (doc) =>
    //             ({
    //                 id: doc.id,
    //                 ...doc.data(),
    //             } as BookComment)
    //     );
    //     setLastCommentDoc(commentDocs.docs[commentDocs.docs.length - 1]);
    //     return {
    //         comments,
    //         totalPage,
    //     };
    // };
    // const onVote = async ({
    //     user,
    //     bookId,
    //     value,
    //     oldValue,
    // }: {
    //     user?: UserModel | null;
    //     bookId: string;
    //     value: number;
    //     oldValue: number;
    // }) => {
    //     setVoteLoading(true);
    //     try {
    //         await runTransaction(fireStore, async (transaction) => {
    //             if (user) {
    //                 const bookVoteDocRef = doc(
    //                     collection(
    //                         fireStore,
    //                         firebaseRoute.getUserBookVoteRoute(user.uid)
    //                     ),
    //                     bookId
    //                 );
    //                 const bookDocRef = doc(
    //                     collection(fireStore, firebaseRoute.getAllBookRoute()),
    //                     bookId
    //                 );
    //                 const bookDoc = await transaction.get(bookDocRef);
    //                 if (!bookDoc.exists()) {
    //                     throw "Không tìm thấy sách";
    //                 }
    //                 const { rating, numberOfRates } = bookDoc.data();
    //                 let newRating = 0;
    //                 if (oldValue !== 0) {
    //                     newRating =
    //                         (rating * numberOfRates + value - oldValue) /
    //                         numberOfRates;
    //                     transaction.update(bookVoteDocRef, {
    //                         value,
    //                     });
    //                 } else {
    //                     newRating =
    //                         (rating * numberOfRates + value) /
    //                         (numberOfRates + 1);
    //                     transaction.set(bookVoteDocRef, {
    //                         value,
    //                     });
    //                     transaction.update(bookDocRef, {
    //                         numberOfRates: increment(1),
    //                     });
    //                 }
    //                 transaction.update(bookDocRef, {
    //                     rating: newRating,
    //                 });
    //             }
    //         });
    //     } catch (error) {
    //         console.log(error);
    //     }
    //     setVoteLoading(false);
    // };
    // const onComment = async ({
    //     user,
    //     bookId,
    //     value,
    // }: {
    //     user?: UserModel | null;
    //     bookId: string;
    //     value: string;
    // }) => {
    //     setCommentLoading(true);
    //     try {
    //         if (!user) {
    //             return;
    //         }
    //         const batch = writeBatch(fireStore);
    //         const newComment: BookComment = {
    //             bookId,
    //             creatorId: user.uid,
    //             creatorDisplayName: user.displayName!,
    //             creatorImageUrl: user.photoURL,
    //             text: value,
    //             createdAt: serverTimestamp() as Timestamp,
    //         };
    //         const commentDocRef = doc(
    //             collection(fireStore, firebaseRoute.getAllCommentRoute())
    //         );
    //         const bookDocRef = doc(
    //             collection(fireStore, firebaseRoute.getAllBookRoute()),
    //             bookId
    //         );
    //         batch.set(commentDocRef, newComment);
    //         batch.update(bookDocRef, {
    //             numberOfComments: increment(1),
    //         });
    //         await batch.commit();
    //     } catch (error) {
    //         console.log(error);
    //     }
    //     setCommentLoading(false);
    // };
    // const onAddAndRemoveLibrary = async ({
    //     user,
    //     book,
    //     isAdd,
    // }: {
    //     user: UserModel;
    //     book: BookSnippet;
    //     isAdd: boolean;
    // }) => {
    //     setAddToLibraryLoading(true);
    //     try {
    //         if (user) {
    //             const batch = writeBatch(fireStore);
    //             const userReadingBookDocRef = doc(
    //                 collection(
    //                     fireStore,
    //                     firebaseRoute.getUserReadingBookSnippetRoute(user.uid)
    //                 ),
    //                 book.id
    //             );
    //             const bookDocRef = doc(
    //                 collection(fireStore, firebaseRoute.getAllBookRoute()),
    //                 book.id!
    //             );
    //             const { id, ...rest } = book;
    //             if (isAdd) {
    //                 batch.set(userReadingBookDocRef, rest);
    //                 batch.update(bookDocRef, {
    //                     popularity: increment(1),
    //                 });
    //             } else {
    //                 batch.delete(userReadingBookDocRef);
    //                 batch.update(bookDocRef, {
    //                     popularity: increment(-1),
    //                 });
    //             }
    //             await batch.commit();
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    //     setAddToLibraryLoading(false);
    // };

    return {
        // onVote,
        // onComment,
        // onAddAndRemoveLibrary,
        getBooks,
        // getComments,
        // voteLoading,
        // commentLoading,
        // addToLibraryLoading,
    };
};

export default useBook;
