import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { Author } from "@/models/Author";
import { Book, BookSnippet } from "@/models/Book";
import { Comment } from "@/models/Comment";
import { Community } from "@/models/Community";
import { Genre } from "@/models/Genre";
import { Message } from "@/models/Message";
import { Post } from "@/models/Post";
import { Review } from "@/models/Review";
import { Topic, TopicReply } from "@/models/Topic";
import { CommunityUserSnippet, UserModel } from "@/models/User";
import { triGram } from "@/utils/StringUtils";
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

export interface PaginationInput {
    page: number;
    totalPage: number;
    pageCount: number;
    isNext: boolean;
    loading: boolean;
    isFirst: boolean;
}

export const defaultPaginationInput = {
    page: 1,
    isNext: true,
    isFirst: true,
    pageCount: 1,
    loading: false,
    totalPage: 1,
};

export type FilterValue = "rating" | "popularity" | "numberOfReviews";

type FilterLabel = "Điểm Đánh Giá" | "Số Người Đọc" | "Số Bài Đánh Giá";

export type Filter = {
    label: FilterLabel;
    value: FilterValue;
};

export const filterList: Filter[] = [
    {
        label: "Số Người Đọc",
        value: "popularity",
    },
    {
        label: "Số Bài Đánh Giá",
        value: "numberOfReviews",
    },
    {
        label: "Điểm Đánh Giá",
        value: "rating",
    },
];

export interface BookPaginationInput extends PaginationInput {
    genreId?: string;
    authorId?: string;
    filter?: FilterValue;
}

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

interface CommentPaginationInfo extends PaginationInfo {
    commentRoute: string;
}

interface PostPaginationInfo extends PaginationInfo {
    communityId?: string;
    isAccept?: boolean;
}

interface TopicPaginationInfo extends PaginationInfo {
    communityId: string;
    isAccept?: boolean;
}

interface TopicReplyPaginationInfo extends PaginationInfo {
    topicId: string;
    communityId: string;
}

interface UserPaginationInfo extends PaginationInfo {
    communityId?: string;
    isAccept?: boolean;
}

interface MessagePaginationInfo extends PaginationInfo {
    userId: string;
    receiverId: string;
    exceptionCount?: number;
}

type DocPosition = {
    firstDoc: QueryDocumentSnapshot<DocumentData> | null;
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
};

// Edit here
type PaginationDocState = {
    book: DocPosition;
    review: DocPosition;
    author: DocPosition;
    community: DocPosition;
    writingBook: DocPosition;
    readingBook: DocPosition;
    comment: DocPosition;
    post: DocPosition;
    user: DocPosition;
    topic: DocPosition;
    topicReply: DocPosition;
    genre: DocPosition;
    message: DocPosition;
};

// Edit here
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
    comment: {
        firstDoc: null,
        lastDoc: null,
    },
    post: {
        firstDoc: null,
        lastDoc: null,
    },
    user: {
        firstDoc: null,
        lastDoc: null,
    },
    topic: {
        firstDoc: null,
        lastDoc: null,
    },
    topicReply: {
        firstDoc: null,
        lastDoc: null,
    },
    genre: {
        firstDoc: null,
        lastDoc: null,
    },
    message: {
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
        exceptionCount = 0,
    }: {
        docsRef: CollectionReference<DocumentData>;
        queryConstraints: any[];
        page: number;
        pageCount: number;
        isNext: boolean;
        exceptionCount?: number;
        field:
            | "book"
            | "review"
            | "author"
            | "community"
            | "readingBook"
            | "writingBook"
            | "comment"
            | "post"
            | "user"
            | "topic"
            | "topicReply"
            | "genre"
            | "message";
        // Edit here
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
        const totalPage = Math.ceil(
            (snapShot.data().count - exceptionCount) / pageCount
        );
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
        let docQuery = query(docsRef, limit(pageCount), ...queryConstraints);
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
            triGram(searchValue).map.forEach((name) => {
                queryConstraints.push(where(`trigramName.${name}`, "==", true));
            });
        }
        if (genreId) {
            queryConstraints.push(where("genreIds", "array-contains", genreId));
        }
        if (authorId) {
            queryConstraints.push(
                where("authorIds", "array-contains", authorId)
            );
        }
        if (!searchValue) {
            if (filter) {
                queryConstraints.push(orderBy(filter, "desc"));
            } else {
                queryConstraints.push(orderBy("createdAt", "desc"));
            }
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
            triGram(searchValue).map.forEach((name) => {
                queryConstraints.push(
                    where(`trigramTitle.${name}`, "==", true)
                );
            });
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
            triGram(searchValue).map.forEach((name) => {
                queryConstraints.push(where(`trigramName.${name}`, "==", true));
            });
        } else {
            queryConstraints.push(orderBy("createdAt", "desc"));
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

    const getGenres = async ({
        page,
        isNext,
        pageCount,
        searchValue,
        isFirst,
    }: PaginationInfo) => {
        const genreDocsRef = collection(
            fireStore,
            firebaseRoute.getAllGenreRoute()
        );
        const queryConstraints = [];
        if (searchValue) {
            triGram(searchValue).map.forEach((name) => {
                queryConstraints.push(where(`trigramName.${name}`, "==", true));
            });
        } else {
            queryConstraints.push(orderBy("createdAt", "desc"));
        }
        const res = await pagination({
            docsRef: genreDocsRef,
            page,
            pageCount,
            queryConstraints,
            isNext,
            field: "genre",
            isFirst,
        });
        return {
            genres: res?.res as Genre[],
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
            triGram(searchValue).map.forEach((name) => {
                queryConstraints.push(where(`trigramName.${name}`, "==", true));
            });
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

    const getComments = async ({
        page,
        pageCount,
        isFirst,
        isNext,
        commentRoute,
    }: CommentPaginationInfo) => {
        const queryConstraints = [];
        queryConstraints.push(orderBy("createdAt", "desc"));
        const commentDocsRef = collection(fireStore, commentRoute);
        const res = await pagination({
            docsRef: commentDocsRef,
            page,
            pageCount,
            queryConstraints,
            isNext,
            field: "comment",
            isFirst,
        });
        return {
            comments: res ? (res.res as Comment[]) : [],
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

    const getPosts = async ({
        isNext,
        page,
        pageCount,
        isFirst,
        communityId,
        isAccept,
    }: PostPaginationInfo) => {
        const queryConstraints = [];
        queryConstraints.push(orderBy("createdAt", "desc"));
        if (isAccept != undefined) {
            queryConstraints.push(where("isAccept", "==", isAccept));
        }
        const postDocsRef = collection(
            fireStore,
            communityId
                ? firebaseRoute.getCommunityPostRoute(communityId)
                : firebaseRoute.getAllPostRoute()
        );
        const res = await pagination({
            docsRef: postDocsRef,
            page,
            pageCount,
            queryConstraints,
            isNext,
            field: "post",
            isFirst,
        });
        return {
            posts: res?.res as Post[],
            totalPage: res?.totalPage,
        };
    };

    const getTopics = async ({
        isNext,
        page,
        pageCount,
        isFirst,
        communityId,
        isAccept,
        searchValue,
    }: TopicPaginationInfo) => {
        const queryConstraints = [];
        if (!searchValue) {
            queryConstraints.push(orderBy("createdAt", "desc"));
            if (isAccept != undefined) {
                queryConstraints.push(where("isAccept", "==", isAccept));
            }
        } else {
            triGram(searchValue).map.forEach((name) => {
                queryConstraints.push(
                    where(`trigramTitle.${name}`, "==", true)
                );
            });
        }
        const topicDocsRef = collection(
            fireStore,
            firebaseRoute.getCommunityTopicRoute(communityId)
        );
        const res = await pagination({
            docsRef: topicDocsRef,
            page,
            pageCount,
            queryConstraints,
            isNext,
            field: "topic",
            isFirst,
        });
        return {
            topics: res?.res as Topic[],
            totalPage: res?.totalPage,
        };
    };

    const getUsers = async ({
        isNext,
        page,
        pageCount,
        isFirst,
        communityId,
        isAccept,
        searchValue,
    }: UserPaginationInfo) => {
        const queryConstraints = [];
        if (!searchValue) {
            queryConstraints.push(orderBy("createdAt", "desc"));
            if (isAccept != undefined) {
                queryConstraints.push(where("isAccept", "==", isAccept));
            }
        } else {
            triGram(searchValue).map.forEach((name) => {
                queryConstraints.push(where(`trigramName.${name}`, "==", true));
            });
        }
        const userDocsRef = collection(
            fireStore,
            communityId
                ? firebaseRoute.getCommunityUserRoute(communityId)
                : firebaseRoute.getAllUserRoute()
        );
        const res = await pagination({
            docsRef: userDocsRef,
            page,
            pageCount,
            queryConstraints,
            isNext,
            field: "user",
            isFirst,
        });
        if (!communityId) {
            const userRes = res?.res.map((e) => {
                const { id, ...rest } = e;
                return rest;
            });
            return {
                users: userRes as UserModel[],
                totalPage: res?.totalPage,
            };
        }
        return {
            users: res?.res as CommunityUserSnippet[],
            totalPage: res?.totalPage,
        };
    };

    const getTopicReplies = async ({
        communityId,
        isNext,
        page,
        pageCount,
        topicId,
        isFirst,
    }: TopicReplyPaginationInfo) => {
        const queryConstraints = [];
        queryConstraints.push(orderBy("createdAt", "desc"));
        const topicReplyDocsRef = collection(
            fireStore,
            firebaseRoute.getCommunityTopicReplyRoute(communityId, topicId)
        );
        const res = await pagination({
            docsRef: topicReplyDocsRef,
            page,
            pageCount,
            queryConstraints,
            isNext,
            field: "topicReply",
            isFirst,
        });
        return {
            topicReplies: res?.res as TopicReply[],
            totalPage: res?.totalPage,
        };
    };

    const getMessages = async ({
        page,
        isNext,
        pageCount,
        isFirst,
        receiverId,
        userId,
        exceptionCount = 0,
    }: MessagePaginationInfo) => {
        const messageDocsRef = collection(
            fireStore,
            firebaseRoute.getUserMessageDetailRoute(userId, receiverId)
        );
        const queryConstraints = [];
        queryConstraints.push(orderBy("createdAt", "desc"));
        const res = await pagination({
            docsRef: messageDocsRef,
            page,
            pageCount,
            queryConstraints,
            isNext,
            field: "message",
            isFirst,
            exceptionCount,
        });
        return {
            messages: res?.res as Message[],
            totalPage: res?.totalPage,
        };
    };

    // Edit Here

    return {
        getBooks,
        getReviews,
        getAuthors,
        getGenres,
        getCommunities,
        getComments,
        getReadingBookSnippets,
        getWritingBookSnippets,
        getPosts,
        getUsers,
        getTopics,
        getTopicReplies,
        getMessages,
    };
};

export default usePagination;
