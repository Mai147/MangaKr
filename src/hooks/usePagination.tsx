import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { Author } from "@/models/Author";
import { Book, BookSnippet } from "@/models/Book";
import { Community } from "@/models/Community";
import { Review } from "@/models/Review";
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
    CollectionReference,
} from "firebase/firestore";
import { useState } from "react";

interface PaginationInfo {
    page: number;
    pageCount: number;
    isNext: boolean;
    searchValue?: string;
    isFirst?: boolean;
}

interface BookPaginationInfo extends PaginationInfo {
    genreId?: string;
    authorId?: string;
    filter?: string;
}

interface UserBookSnippetPaginationInfo extends PaginationInfo {
    userId: string;
}

type DocPosition = {
    firstDoc: QueryDocumentSnapshot<DocumentData> | null;
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
};

type PaginationDocState = {
    book: DocPosition;
    review: DocPosition;
    author: DocPosition;
    community: DocPosition;
    writingBook: DocPosition;
    readingBook: DocPosition;
};

const defaultPaginationDocState: PaginationDocState = {
    book: {
        firstDoc: null,
        lastDoc: null,
    },
    review: {
        firstDoc: null,
        lastDoc: null,
    },
    author: {
        firstDoc: null,
        lastDoc: null,
    },
    community: {
        firstDoc: null,
        lastDoc: null,
    },
    readingBook: {
        firstDoc: null,
        lastDoc: null,
    },
    writingBook: {
        firstDoc: null,
        lastDoc: null,
    },
};

const usePagination = () => {
    const [paginationDoc, setPaginationDoc] = useState<PaginationDocState>(
        defaultPaginationDocState
    );

    const pagination = async ({
        docsRef,
        queryConstraints,
        page,
        pageCount,
        isNext,
        field,
        isFirst,
    }: {
        docsRef: CollectionReference<DocumentData>;
        queryConstraints: any[];
        page: number;
        pageCount: number;
        isNext: boolean;
        field:
            | "book"
            | "review"
            | "author"
            | "community"
            | "readingBook"
            | "writingBook";
        isFirst?: boolean;
    }) => {
        const firstDoc = isFirst
            ? defaultPaginationDocState[field].firstDoc
            : paginationDoc[field].firstDoc;
        const lastDoc = isFirst
            ? defaultPaginationDocState[field].lastDoc
            : paginationDoc[field].lastDoc;
        const snapShot = await getCountFromServer(
            query(docsRef, ...queryConstraints)
        );
        const totalPage = Math.ceil(snapShot.data().count / pageCount);
        if (isNext) {
            if (page > 1) {
                if (page <= totalPage) {
                    queryConstraints.push(startAfter(lastDoc));
                    queryConstraints.push(limit(pageCount));
                } else return;
            }
        } else {
            if (page >= 1) {
                queryConstraints.push(endBefore(firstDoc));
                queryConstraints.push(limitToLast(pageCount));
            } else return;
        }
        const docQuery = query(docsRef, limit(pageCount), ...queryConstraints);
        const docs = await getDocs(docQuery);
        const res = docs.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setPaginationDoc((prev) => ({
            ...prev,
            [field]: {
                firstDoc: docs.docs[0],
                lastDoc: docs.docs[docs.docs.length - 1],
            },
        }));
        return {
            res,
            totalPage,
        };
    };

    const getBooks = async ({
        page,
        pageCount,
        isNext,
        genreId,
        authorId,
        filter,
        searchValue,
        isFirst,
    }: BookPaginationInfo) => {
        const bookDocsRef = collection(
            fireStore,
            firebaseRoute.getAllBookRoute()
        );
        const queryConstraints = [];
        if (searchValue) {
            queryConstraints.push(
                where("nameLowerCase", ">=", searchValue.toLowerCase())
            );
            queryConstraints.push(
                where(
                    "nameLowerCase",
                    "<=",
                    searchValue.toLowerCase() + `\uf8ff`
                )
            );
            queryConstraints.push(orderBy("nameLowerCase"));
        }
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
        } else if (!searchValue) {
            queryConstraints.push(orderBy("createdAt", "desc"));
        }
        const res = await pagination({
            docsRef: bookDocsRef,
            queryConstraints,
            page,
            pageCount,
            isNext,
            field: "book",
            isFirst,
        });
        return {
            books: res?.res as Book[],
            totalPage: res?.totalPage,
        };
    };

    const getReviews = async ({
        page,
        isNext,
        pageCount,
        searchValue,
        isFirst,
    }: PaginationInfo) => {
        const reviewDocsRef = collection(
            fireStore,
            firebaseRoute.getAllReviewRoute()
        );
        const queryConstraints = [];
        if (searchValue) {
            queryConstraints.push(
                where("titleLowerCase", ">=", searchValue.toLowerCase())
            );
            queryConstraints.push(
                where(
                    "titleLowerCase",
                    "<=",
                    searchValue.toLowerCase() + `\uf8ff`
                )
            );
            queryConstraints.push(orderBy("titleLowerCase"));
        } else {
            queryConstraints.push(orderBy("createdAt", "desc"));
        }
        const res = await pagination({
            docsRef: reviewDocsRef,
            page,
            pageCount,
            queryConstraints,
            isNext,
            field: "review",
            isFirst,
        });
        return {
            reviews: res?.res as Review[],
            totalPage: res?.totalPage,
        };
    };

    const getAuthors = async ({
        page,
        isNext,
        pageCount,
        searchValue,
        isFirst,
    }: PaginationInfo) => {
        const authorDocsRef = collection(
            fireStore,
            firebaseRoute.getAllAuthorRoute()
        );
        const queryConstraints = [];
        if (searchValue) {
            queryConstraints.push(
                where("nameLowerCase", ">=", searchValue.toLowerCase())
            );
            queryConstraints.push(
                where(
                    "nameLowerCase",
                    "<=",
                    searchValue.toLowerCase() + `\uf8ff`
                )
            );
            queryConstraints.push(orderBy("nameLowerCase"));
        }
        const res = await pagination({
            docsRef: authorDocsRef,
            page,
            pageCount,
            queryConstraints,
            isNext,
            field: "author",
            isFirst,
        });
        return {
            authors: res?.res as Author[],
            totalPage: res?.totalPage,
        };
    };

    const getCommunities = async ({
        page,
        isNext,
        pageCount,
        searchValue,
        isFirst,
    }: PaginationInfo) => {
        const communityDocsRef = collection(
            fireStore,
            firebaseRoute.getAllCommunityRoute()
        );
        const queryConstraints = [];
        if (searchValue) {
            queryConstraints.push(
                where("nameLowerCase", ">=", searchValue.toLowerCase())
            );
            queryConstraints.push(
                where(
                    "nameLowerCase",
                    "<=",
                    searchValue.toLowerCase() + `\uf8ff`
                )
            );
            queryConstraints.push(orderBy("nameLowerCase"));
        } else {
            queryConstraints.push(orderBy("createdAt", "desc"));
        }
        const res = await pagination({
            docsRef: communityDocsRef,
            page,
            pageCount,
            queryConstraints,
            isNext,
            field: "community",
            isFirst,
        });
        return {
            communities: res?.res as Community[],
            totalPage: res?.totalPage,
        };
    };

    const getWritingBookSnippets = async ({
        page,
        pageCount,
        isNext,
        isFirst,
        userId,
    }: UserBookSnippetPaginationInfo) => {
        const writingBookDocsRef = collection(
            fireStore,
            firebaseRoute.getUserWritingBookSnippetRoute(userId)
        );
        const res = await pagination({
            docsRef: writingBookDocsRef,
            queryConstraints: [],
            page,
            pageCount,
            isNext,
            field: "writingBook",
            isFirst,
        });
        return {
            books: res?.res as BookSnippet[],
            totalPage: res?.totalPage,
        };
    };

    const getReadingBookSnippets = async ({
        page,
        pageCount,
        isNext,
        isFirst,
        userId,
    }: UserBookSnippetPaginationInfo) => {
        const writingBookDocsRef = collection(
            fireStore,
            firebaseRoute.getUserReadingBookSnippetRoute(userId)
        );
        const res = await pagination({
            docsRef: writingBookDocsRef,
            queryConstraints: [],
            page,
            pageCount,
            isNext,
            field: "readingBook",
            isFirst,
        });
        return {
            books: res?.res as BookSnippet[],
            totalPage: res?.totalPage,
        };
    };

    return {
        getBooks,
        getReviews,
        getAuthors,
        getCommunities,
        getReadingBookSnippets,
        getWritingBookSnippets,
    };
};

export default usePagination;
