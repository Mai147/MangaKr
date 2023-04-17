import { firebaseRoute } from "@/constants/firebaseRoutes";
import { PrivacyType } from "@/constants/privacy";
import { fireStore } from "@/firebase/clientApp";
import { FilterValue } from "@/models/Book";
import { Voting } from "@/models/Vote";
import VotingService from "@/services/VotingService";
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

export interface PaginationInput {
    page: number;
    pageCount: number;
    isNext: boolean;
    docValue: DocPosition;
    searchValue?: string;
    isFirst?: boolean;
    exceptionCount?: number;
    setDocValue: (docValue: DocPosition) => void;
}

export interface PaginationOutput {
    page: number;
    totalPage: number;
    list: any;
}

export const defaultPaginationInput: PaginationInput = {
    page: 1,
    isNext: true,
    isFirst: true,
    pageCount: 1,
    exceptionCount: 0,
    docValue: {
        firstDoc: null,
        lastDoc: null,
    },
    setDocValue: () => {},
};

export const defaultPaginationOutput: PaginationOutput = {
    list: [],
    page: 1,
    totalPage: 0,
};

export interface BookPaginationInput extends PaginationInput {
    genreId?: string;
    authorId?: string;
    filter?: FilterValue;
}

export interface UserBookSnippetPaginationInput extends PaginationInput {
    userId: string;
}

export interface CommentPaginationInput extends PaginationInput {
    commentRoute: string;
}

export interface PostPaginationInput extends PaginationInput {
    communityId?: string;
    isAccept?: boolean;
    isLock?: boolean;
    userId?: string;
    privacyTypes?: PrivacyType[];
}

export interface TopicPaginationInput extends PaginationInput {
    communityId: string;
    isAccept?: boolean;
}

export interface TopicReplyPaginationInput extends PaginationInput {
    topicId: string;
    communityId: string;
}

export interface VotingPaginationInput extends PaginationInput {
    communityId: string;
    isAccept?: boolean;
}

export interface VotingOptionPaginationInput extends PaginationInput {
    votingId: string;
    communityId: string;
}

export interface UserPaginationInput extends PaginationInput {
    communityId?: string;
    isAccept?: boolean;
}

export interface MessagePaginationInput extends PaginationInput {
    userId: string;
    receiverId: string;
    exceptionCount?: number;
}

export interface CommunityPaginationInput extends PaginationInput {
    userId?: string;
}

export interface ReviewPaginationInput extends PaginationInput {
    bookId?: string;
}

export interface FollowPaginationInput extends PaginationInput {
    userId: string;
    isAccept?: boolean;
}

export type DocPosition = {
    firstDoc: QueryDocumentSnapshot<DocumentData> | null;
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
};

type PaginationFuncInput = {
    docsRef: CollectionReference<DocumentData>;
    queryConstraints: any[];
    // field: PaginationField;
    paginationInput: PaginationInput;
};

const usePagination = () => {
    const pagination = async (
        paginationFuncInput: PaginationFuncInput
    ): Promise<PaginationOutput | undefined> => {
        try {
            const { docsRef, paginationInput, queryConstraints } =
                paginationFuncInput;
            const {
                docValue,
                isNext,
                page,
                pageCount,
                exceptionCount,
                setDocValue,
                isFirst,
            } = paginationInput;
            const firstDoc = isFirst ? null : docValue.firstDoc;
            const lastDoc = isFirst ? null : docValue.lastDoc;
            const snapShot = await getCountFromServer(
                query(docsRef, ...queryConstraints)
            );
            const totalPage = Math.ceil(
                (snapShot.data().count - (exceptionCount || 0)) / pageCount
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
            let docQuery = query(
                docsRef,
                limit(pageCount),
                ...queryConstraints
            );
            const docs = await getDocs(docQuery);
            const res = docs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setDocValue({
                firstDoc: docs.docs[0],
                lastDoc: docs.docs[docs.docs.length - 1],
            });
            return {
                list: res,
                totalPage,
                page,
            };
        } catch (error) {
            console.log(error);
        }
    };

    const getBooks = async (input: BookPaginationInput) => {
        const { searchValue, genreId, authorId, filter } = input;
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
            paginationInput: input,
        });
        return res;
    };

    const getReviews = async (input: ReviewPaginationInput) => {
        const { searchValue, bookId } = input;
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
        if (bookId) {
            queryConstraints.push(where("bookId", "==", bookId));
        }
        const res = await pagination({
            docsRef: reviewDocsRef,
            queryConstraints,
            paginationInput: input,
        });
        return res;
    };

    const getAuthors = async (input: PaginationInput) => {
        const { searchValue } = input;
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
            queryConstraints,
            paginationInput: input,
        });
        return res;
    };

    const getGenres = async (input: PaginationInput) => {
        const { searchValue } = input;
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
            queryConstraints,
            paginationInput: input,
        });
        return res;
    };

    const getCommunities = async (input: CommunityPaginationInput) => {
        const { searchValue, userId } = input;
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
        if (userId) {
            queryConstraints.push(where("userIds", "array-contains", userId));
        }
        const res = await pagination({
            docsRef: communityDocsRef,
            queryConstraints,
            paginationInput: input,
        });
        return res;
    };

    const getComments = async (input: CommentPaginationInput) => {
        const { commentRoute } = input;
        const queryConstraints = [];
        queryConstraints.push(orderBy("createdAt", "desc"));
        const commentDocsRef = collection(fireStore, commentRoute);
        const res = await pagination({
            docsRef: commentDocsRef,
            queryConstraints,
            paginationInput: input,
        });
        return res;
    };

    const getWritingBookSnippets = async (
        input: UserBookSnippetPaginationInput
    ) => {
        const { userId } = input;
        const writingBookDocsRef = collection(
            fireStore,
            firebaseRoute.getUserWritingBookSnippetRoute(userId)
        );
        const res = await pagination({
            docsRef: writingBookDocsRef,
            queryConstraints: [],
            paginationInput: input,
        });
        return res;
    };

    const getReadingBookSnippets = async (
        input: UserBookSnippetPaginationInput
    ) => {
        const { userId } = input;
        const writingBookDocsRef = collection(
            fireStore,
            firebaseRoute.getUserReadingBookSnippetRoute(userId)
        );
        const res = await pagination({
            docsRef: writingBookDocsRef,
            queryConstraints: [],
            paginationInput: input,
        });
        return res;
    };

    const getPosts = async (input: PostPaginationInput) => {
        const { isAccept, isLock, communityId, userId, privacyTypes } = input;
        const queryConstraints = [];
        queryConstraints.push(orderBy("createdAt", "desc"));
        if (isAccept !== undefined) {
            queryConstraints.push(where("isAccept", "==", isAccept));
        }
        if (isLock !== undefined) {
            queryConstraints.push(where("isLock", "==", isLock));
        }
        if (privacyTypes !== undefined && privacyTypes.length > 0) {
            queryConstraints.push(where("privacyType", "in", privacyTypes));
        }
        const postDocsRef = collection(
            fireStore,
            communityId
                ? firebaseRoute.getCommunityPostRoute(communityId)
                : firebaseRoute.getUserPostRoute(userId!)
        );
        const res = await pagination({
            docsRef: postDocsRef,
            queryConstraints,
            paginationInput: input,
        });
        return res;
    };

    const getTopics = async (input: TopicPaginationInput) => {
        const { searchValue, isAccept, communityId } = input;
        const queryConstraints = [];
        if (!searchValue) {
            queryConstraints.push(orderBy("createdAt", "desc"));
        } else {
            triGram(searchValue).map.forEach((name) => {
                queryConstraints.push(
                    where(`trigramTitle.${name}`, "==", true)
                );
            });
        }
        if (isAccept != undefined) {
            queryConstraints.push(where("isAccept", "==", isAccept));
        }
        const topicDocsRef = collection(
            fireStore,
            firebaseRoute.getCommunityTopicRoute(communityId)
        );
        const res = await pagination({
            docsRef: topicDocsRef,
            queryConstraints,
            paginationInput: input,
        });
        return res;
    };

    const getUsers = async (input: UserPaginationInput) => {
        const { searchValue, isAccept, communityId } = input;
        const queryConstraints = [];
        if (isAccept != undefined) {
            queryConstraints.push(where("isAccept", "==", isAccept));
        }
        if (!searchValue) {
            queryConstraints.push(orderBy("createdAt", "desc"));
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
            queryConstraints,
            paginationInput: input,
        });
        return res;
    };

    const getTopicReplies = async (input: TopicReplyPaginationInput) => {
        const { communityId, topicId } = input;
        const queryConstraints = [];
        queryConstraints.push(orderBy("createdAt", "desc"));
        const topicReplyDocsRef = collection(
            fireStore,
            firebaseRoute.getCommunityTopicReplyRoute(communityId, topicId)
        );
        const res = await pagination({
            docsRef: topicReplyDocsRef,
            queryConstraints,
            paginationInput: input,
        });
        return res;
    };

    const getMessages = async (input: MessagePaginationInput) => {
        const { userId, receiverId } = input;
        const messageDocsRef = collection(
            fireStore,
            firebaseRoute.getUserMessageDetailRoute(userId, receiverId)
        );
        const queryConstraints = [];
        queryConstraints.push(orderBy("createdAt", "desc"));
        const res = await pagination({
            docsRef: messageDocsRef,
            queryConstraints,
            paginationInput: input,
        });
        return res;
    };

    const getFollows = async (input: FollowPaginationInput) => {
        const { userId, isAccept } = input;
        const queryConstraints = [];
        queryConstraints.push(orderBy("createdAt", "desc"));
        if (isAccept != undefined) {
            queryConstraints.push(where("isAccept", "==", isAccept));
        }
        const followDocsRef = collection(
            fireStore,
            firebaseRoute.getUserFollowRoute(userId)
        );
        const res = await pagination({
            docsRef: followDocsRef,
            queryConstraints,
            paginationInput: input,
        });
        return res;
    };

    const getFolloweds = async (input: FollowPaginationInput) => {
        const { userId, isAccept } = input;
        const queryConstraints = [];
        queryConstraints.push(orderBy("createdAt", "desc"));
        if (isAccept != undefined) {
            queryConstraints.push(where("isAccept", "==", isAccept));
        }
        const followDocsRef = collection(
            fireStore,
            firebaseRoute.getUserFollowedRoute(userId)
        );
        const res = await pagination({
            docsRef: followDocsRef,
            queryConstraints,
            paginationInput: input,
        });
        return res;
    };

    const getVotings = async (input: VotingPaginationInput) => {
        const { searchValue, isAccept, communityId } = input;
        const queryConstraints = [];
        if (!searchValue) {
            queryConstraints.push(orderBy("createdAt", "desc"));
        } else {
            triGram(searchValue).map.forEach((name) => {
                queryConstraints.push(
                    where(`trigramContent.${name}`, "==", true)
                );
            });
        }
        if (isAccept != undefined) {
            queryConstraints.push(where("isAccept", "==", isAccept));
        }
        const votingDocsRef = collection(
            fireStore,
            firebaseRoute.getCommunityVotingRoute(communityId)
        );
        const res = await pagination({
            docsRef: votingDocsRef,
            queryConstraints,
            paginationInput: input,
        });
        if (res) {
            for (const idx in res.list) {
                const item = res.list[idx];
                const votingOptions = await VotingService.getOptions({
                    communityId,
                    votingId: item.id,
                });
                res.list[idx].options = votingOptions;
            }
        }
        return res;
    };

    const getVotingOptions = async (input: VotingOptionPaginationInput) => {
        const { communityId, votingId } = input;
        const votingOptionsDocsRef = collection(
            fireStore,
            firebaseRoute.getCommunityVotingOptionRoute(communityId, votingId)
        );
        const res = await pagination({
            docsRef: votingOptionsDocsRef,
            queryConstraints: [],
            paginationInput: input,
        });
        return res;
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
        getVotings,
        getVotingOptions,
        getMessages,
        getFollows,
        getFolloweds,
    };
};

export default usePagination;
