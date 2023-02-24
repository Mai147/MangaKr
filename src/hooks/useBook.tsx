import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { Book } from "@/models/Book";
import {
    collection,
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
} from "firebase/firestore";
import { useState } from "react";

const useBook = () => {
    const [firstBookDoc, setFirstBookDocs] =
        useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [lastBookDoc, setLastBookDoc] =
        useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const getBooks = async ({
        page,
        pageCount,
        isNext,
        genreId,
        authorId,
        filter,
    }: {
        page: number;
        pageCount: number;
        isNext: boolean;
        genreId?: string;
        authorId?: string;
        filter?: string;
    }) => {
        const bookDocsRef = collection(
            fireStore,
            firebaseRoute.getAllBookRoute()
        );
        const queryConstraints = [];
        if (genreId) {
            queryConstraints.push(where("genreIds", "array-contains", genreId));
        }
        if (authorId) {
            queryConstraints.push(
                where("authorIds", "array-contains", authorId)
            );
        }
        if (filter) {
            queryConstraints.push(orderBy(filter, "desc"));
        } else {
            queryConstraints.push(orderBy("createdAt", "desc"));
        }
        const snapShot = await getCountFromServer(
            query(bookDocsRef, ...queryConstraints)
        );
        const totalPage = Math.ceil(snapShot.data().count / pageCount);
        if (isNext) {
            if (page > 1) {
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

    return {
        getBooks,
    };
};

export default useBook;
