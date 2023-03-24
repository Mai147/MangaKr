import { firebaseRoute } from "@/constants/firebaseRoutes";
import { POST_PAGE_COUNT } from "@/constants/pagination";
import { CommunityRole } from "@/constants/roles";
import { fireStore } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import usePagination, {
    defaultPaginationInput,
    PaginationInput,
} from "@/hooks/usePagination";
import { Comment } from "@/models/Comment";
import { Community } from "@/models/Community";
import { CommunityPost } from "@/models/Post";
import { PostVote, postVoteList, Vote } from "@/models/Vote";
import CommentUtils from "@/utils/CommentUtils";
import CommunityUtils from "@/utils/CommunityUtils";
import VoteUtils from "@/utils/VoteUtils";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    serverTimestamp,
    Timestamp,
    updateDoc,
    writeBatch,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

interface CommunityPostPaginationInput extends PaginationInput {
    communityId: string;
}

interface CommunityPostCommentPaginationInput {
    postId: string;
    inputState: PaginationInput;
}

const defaultCommunityPostPaginationInput: CommunityPostPaginationInput = {
    ...defaultPaginationInput,
    pageCount: POST_PAGE_COUNT,
    communityId: "",
};

const defaultCommunityPostCommentPaginationInput: CommunityPostCommentPaginationInput =
    {
        postId: "",
        inputState: {
            ...defaultPaginationInput,
            pageCount: 3,
        },
    };

type CommunityPostPagination = {
    state: CommunityPostPaginationInput;
    onNext: () => void;
};

type CommunityPostCommentPagination = {
    state: CommunityPostCommentPaginationInput;
    onNext: () => void;
};

type CommunityPostVote = {
    postId: string;
    voteValue?: PostVote;
};

export type CommunityPostCommentData = {
    comment: Comment;
    userVote?: Vote;
};

type CommunityPostComment = {
    postId: string;
    comments: CommunityPostCommentData[];
};

type CommunityState = {
    selectedCommunity?: Community | null;
    communityPosts?: CommunityPost[];
    communityPostVotes?: CommunityPostVote[];
    communityPostComments?: CommunityPostComment[];
    communityPostPagination?: CommunityPostPagination;
    communityPostCommentPaginations?: CommunityPostCommentPagination[];
    userCommunityRole?: CommunityRole;
};

type CommunityAction = {
    setSelectedCommunity: (community: Community) => void;
    onPostVote: (vote: PostVote, postId: string) => Promise<void>;
    onPostComment: (commentText: string, postId: string) => Promise<void>;
    onPostCommentVote: (
        vote: Vote,
        commentId: string,
        postId: string
    ) => Promise<void>;
};

type CommunityContextState = {
    communityState: CommunityState;
    communityAction: CommunityAction;
};

const defaultCommunityContextState: CommunityContextState = {
    communityState: {},
    communityAction: {
        setSelectedCommunity: () => {},
        onPostVote: async () => {},
        onPostComment: async () => {},
        onPostCommentVote: async () => {},
    },
};

export const CommunityContext = createContext<CommunityContextState>(
    defaultCommunityContextState
);

export const CommunityProvider = ({ children }: any) => {
    const { toggleView } = useModal();
    const { user } = useAuth();
    const router = useRouter();
    const [communityState, setCommunityState] = useState<CommunityContextState>(
        defaultCommunityContextState
    );
    const [communityPostPaginationInput, setCommunityPostPaginationInput] =
        useState<CommunityPostPaginationInput>(
            defaultCommunityPostPaginationInput
        );
    const [
        communityPostCommentPaginationInputs,
        setCommunityPostCommentPaginationInputs,
    ] = useState<CommunityPostCommentPaginationInput[]>([]);
    const [selectedPostId, setSelectedPostId] = useState<string | undefined>();
    const { getPosts, getComments } = usePagination();

    const getCommunity = async (communityId: string) => {
        const res = await CommunityUtils.getCommunity(communityId);
        setCommunityState((prev) => ({
            ...prev,
            communityState: {
                ...prev.communityState,
                selectedCommunity: res ? res : null,
            },
        }));
    };

    const getUserCommunityRole = async (
        communityId: string,
        userId: string
    ) => {
        const userCommunityRole = await CommunityUtils.getUserCommunityRole(
            communityId,
            userId
        );
        setCommunityState((prev) => ({
            ...prev,
            communityState: {
                ...prev.communityState,
                userCommunityRole,
            },
        }));
    };

    const getCommunityPosts = async (communityId: string) => {
        const { page, pageCount, isNext } = communityPostPaginationInput;
        setCommunityPostPaginationInput((prev) => ({
            ...prev,
            loading: true,
        }));
        const res = await getPosts({
            page,
            pageCount,
            isFirst: false,
            isNext,
            communityId,
        });
        let postVotes: CommunityPostVote[] = [];
        let postComments: CommunityPostComment[] = [];
        if (res.posts) {
            for (const post of res.posts) {
                const commentDatas = await getCommunityPostComments(
                    communityId,
                    post.id!
                );
                postComments.push({
                    postId: post.id!,
                    comments: commentDatas,
                });
                if (user) {
                    const userPostVoteDocRef = doc(
                        fireStore,
                        firebaseRoute.getUserPostVoteRoute(user.uid),
                        post.id!
                    );
                    const postVote = await VoteUtils.getUserVote({
                        voteDocRef: userPostVoteDocRef,
                    });
                    postVotes.push({
                        postId: post.id!,
                        voteValue: postVote,
                    });
                }
            }
        }
        setCommunityPostPaginationInput((prev) => ({
            ...prev,
            totalPage: res?.totalPage || 0,
            loading: false,
        }));
        setCommunityState((prev) => ({
            ...prev,
            communityState: {
                ...prev.communityState,

                communityPosts: [
                    ...(prev.communityState.communityPosts || []),
                    ...(res.posts.map((post) => ({
                        ...post,
                        communityId,
                    })) as CommunityPost[]),
                ],
                communityPostVotes: postVotes,
                communityPostComments: postComments,
            },
        }));
    };

    const getCommunityPostComments = async (
        communityId: string,
        postId: string
    ) => {
        const input = communityPostCommentPaginationInputs.find(
            (item) => item.postId === postId
        );
        let commentInput: PaginationInput = {
            ...defaultCommunityPostCommentPaginationInput.inputState,
        };
        if (input) {
            commentInput = input.inputState;
        }
        if (!input) {
            setCommunityPostCommentPaginationInputs((prev) => [
                ...prev,
                {
                    postId,
                    inputState: {
                        ...commentInput,
                        loading: true,
                    },
                },
            ]);
        } else {
            setCommunityPostCommentPaginationInputs((prev) =>
                prev.map((item) =>
                    item.postId !== postId
                        ? item
                        : {
                              ...item,
                              inputState: {
                                  ...item.inputState,
                                  loading: true,
                              },
                          }
                )
            );
            commentInput = input.inputState;
        }
        const { page, pageCount, isNext } = commentInput;
        const res = await getComments({
            page,
            pageCount,
            isFirst: false,
            isNext,
            commentDocsRef: collection(
                fireStore,
                firebaseRoute.getCommunityPostCommentRoute(communityId, postId)
            ),
        });
        let commentDatas: CommunityPostCommentData[] = [];
        for (const e of res.comments) {
            if (user) {
                const userCommentVoteDocRef = doc(
                    fireStore,
                    firebaseRoute.getUserCommentVoteRoute(user.uid),
                    e.id!
                );
                const userVote = await VoteUtils.getUserVote({
                    voteDocRef: userCommentVoteDocRef,
                });
                const commentData: CommunityPostCommentData = {
                    comment: e,
                    userVote: userVote as Vote,
                };
                commentDatas.push(commentData);
            } else {
                commentDatas.push({ comment: e });
            }
        }
        setCommunityPostCommentPaginationInputs((prev) =>
            prev.map((item) =>
                item.postId !== postId
                    ? item
                    : {
                          ...item,
                          inputState: {
                              ...item.inputState,
                              totalPage: res?.totalPage || 0,
                              loading: false,
                          },
                      }
            )
        );

        return commentDatas;
    };

    const updateUserLatestPost = async (
        userId: string,
        community: Community
    ) => {
        try {
            const userCommunityDocRef = doc(
                fireStore,
                firebaseRoute.getUserCommunitySnippetRoute(userId),
                community.id!
            );
            const res = await getDoc(userCommunityDocRef);
            if (res.exists()) {
                await updateDoc(
                    userCommunityDocRef,
                    "latestPost",
                    community.latestPost
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onPostVote = async (vote: PostVote, postId: string) => {
        if (!user) {
            toggleView("login");
        } else {
            try {
                const { value } = vote;
                const userPostVoteDocRef = doc(
                    fireStore,
                    firebaseRoute.getUserPostVoteRoute(user.uid),
                    postId
                );
                const postDocRef = doc(
                    fireStore,
                    firebaseRoute.getCommunityPostRoute(
                        communityState.communityState.selectedCommunity!.id!
                    ),
                    postId
                );
                const userPostVote =
                    communityState.communityState.communityPostVotes?.find(
                        (item) => item.postId === postId
                    )?.voteValue;
                await VoteUtils.onVote({
                    voteDocRef: userPostVoteDocRef,
                    rootDocRef: postDocRef,
                    userVote: userPostVote,
                    vote,
                });
                setCommunityState((prev) => ({
                    ...prev,
                    communityState: {
                        ...prev.communityState,
                        communityPosts: prev.communityState.communityPosts?.map(
                            (item) =>
                                item.id !== postId
                                    ? item
                                    : {
                                          ...item,
                                          [vote.field]: item[vote.field] + 1,
                                      }
                        ),
                        communityPostVotes:
                            prev.communityState.communityPostVotes?.map(
                                (item) =>
                                    item.postId !== postId
                                        ? item
                                        : {
                                              postId: item.postId,
                                              voteValue:
                                                  value === userPostVote?.value
                                                      ? undefined
                                                      : vote,
                                          }
                            ),
                    },
                }));
                const changing = value === userPostVote?.value ? -2 : -1;
                if (userPostVote && Object.keys(userPostVote).length !== 0) {
                    setCommunityState((prev) => ({
                        ...prev,
                        communityState: {
                            ...prev.communityState,
                            communityPosts:
                                prev.communityState.communityPosts?.map(
                                    (item) =>
                                        item.id !== postId
                                            ? item
                                            : {
                                                  ...item,
                                                  [userPostVote.field]:
                                                      item[userPostVote.field] +
                                                      changing,
                                              }
                                ),
                        },
                    }));
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const onPostComment = async (commentText: string, postId: string) => {
        if (!user) {
            toggleView("login");
            return;
        }
        try {
            const { selectedCommunity } = communityState.communityState;
            const postCommentDocRef = doc(
                collection(
                    fireStore,
                    firebaseRoute.getCommunityPostCommentRoute(
                        selectedCommunity?.id!,
                        postId
                    )
                )
            );
            const postDocRef = doc(
                fireStore,
                firebaseRoute.getCommunityPostRoute(selectedCommunity?.id!),
                postId
            );
            const res = await CommentUtils.onComment({
                user,
                commentText,
                commentDocRef: postCommentDocRef,
                rootDocRef: postDocRef,
            });
            setCommunityState((prev) => ({
                ...prev,
                communityState: {
                    ...prev.communityState,
                    communityPosts: prev.communityState.communityPosts?.map(
                        (post) =>
                            post.id !== postId
                                ? post
                                : {
                                      ...post,
                                      numberOfComments:
                                          post.numberOfComments + 1,
                                  }
                    ),
                    communityPostComments:
                        prev.communityState.communityPostComments?.map(
                            (postComment) =>
                                postComment.postId !== postId
                                    ? postComment
                                    : {
                                          ...postComment,
                                          comments: [
                                              {
                                                  comment: res!,
                                              },
                                              ...postComment.comments,
                                          ],
                                      }
                        ),
                },
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const onPostCommentVote = async (
        vote: Vote,
        commentId: string,
        postId: string
    ) => {
        if (!user) {
            toggleView("login");
            return;
        } else {
            try {
                const { value } = vote;
                const userVote =
                    communityState.communityState.communityPostComments
                        ?.find((item) => item.postId === postId)
                        ?.comments.find(
                            (commentData) =>
                                commentData.comment.id === commentId
                        )?.userVote;
                await VoteUtils.onVote({
                    voteDocRef: doc(
                        fireStore,
                        firebaseRoute.getUserCommentVoteRoute(user.uid),
                        commentId
                    ),
                    rootDocRef: doc(
                        collection(
                            fireStore,
                            firebaseRoute.getCommunityPostCommentRoute(
                                communityState.communityState.selectedCommunity!
                                    .id!,
                                postId
                            )
                        ),
                        commentId
                    ),
                    userVote,
                    vote,
                });
                let likeIncrement = 0;
                let dislikeIncrement = 0;
                if (userVote) {
                    if (userVote.value === "like") {
                        if (value === "like") {
                            likeIncrement = -1;
                        } else {
                            likeIncrement = -1;
                            dislikeIncrement = 1;
                        }
                    } else {
                        if (value === "dislike") {
                            dislikeIncrement = -1;
                        } else {
                            dislikeIncrement = -1;
                            likeIncrement = 1;
                        }
                    }
                } else {
                    if (value === "like") likeIncrement = 1;
                    else dislikeIncrement = 1;
                }
                setCommunityState((prev) => ({
                    ...prev,
                    communityState: {
                        ...prev.communityState,
                        communityPostComments:
                            prev.communityState.communityPostComments?.map(
                                (item) =>
                                    item.postId !== postId
                                        ? item
                                        : {
                                              ...item,
                                              comments: item.comments.map(
                                                  (commentData) =>
                                                      commentData.comment.id !==
                                                      commentId
                                                          ? commentData
                                                          : {
                                                                comment: {
                                                                    ...commentData.comment,
                                                                    numberOfLikes:
                                                                        commentData
                                                                            .comment
                                                                            .numberOfLikes +
                                                                        likeIncrement,
                                                                    numberOfDislikes:
                                                                        commentData
                                                                            .comment
                                                                            .numberOfDislikes +
                                                                        dislikeIncrement,
                                                                },
                                                                userVote:
                                                                    value ===
                                                                    userVote?.value
                                                                        ? undefined
                                                                        : vote,
                                                            }
                                              ),
                                          }
                            ),
                    },
                }));
            } catch (error) {
                console.log(error);
            }
        }
    };

    const updateListComment = async (communityId: string, postId: string) => {
        const res = await getCommunityPostComments(communityId, postId);
        setCommunityState((prev) => ({
            ...prev,
            communityState: {
                ...prev.communityState,
                communityPostComments:
                    prev.communityState.communityPostComments?.map((item) =>
                        item.postId !== postId
                            ? item
                            : {
                                  ...item,
                                  comments: [...item.comments, ...res],
                              }
                    ),
            },
        }));
        setSelectedPostId(undefined);
    };

    useEffect(() => {
        const { selectedCommunity } = communityState.communityState;
        if (selectedCommunity && user) {
            getUserCommunityRole(selectedCommunity.id!, user.uid);
            updateUserLatestPost(user.uid, selectedCommunity);
        }
    }, [communityState.communityState.selectedCommunity?.id, user]);

    useEffect(() => {
        const { selectedCommunity } = communityState.communityState;
        if (selectedCommunity) {
            getCommunityPosts(selectedCommunity.id!);
        }
    }, [
        communityState.communityState.selectedCommunity?.id,
        communityPostPaginationInput.page,
    ]);

    useEffect(() => {
        const { selectedCommunity } = communityState.communityState;
        if (selectedCommunity && selectedPostId) {
            updateListComment(selectedCommunity.id!, selectedPostId);
        }
    }, [communityState.communityState.selectedCommunity?.id, selectedPostId]);

    useEffect(() => {
        const { cid } = router.query;
        if (cid) {
            getCommunity(cid as string);
        } else {
            setCommunityState((prev) => ({
                ...prev,
                communityState: {
                    ...prev,
                    selectedCommunity: undefined,
                },
            }));
        }
    }, [router.query]);

    return (
        <CommunityContext.Provider
            value={{
                communityAction: {
                    ...communityState.communityAction,
                    setSelectedCommunity: (community) =>
                        setCommunityState((prev) => ({
                            ...prev,
                            communityState: {
                                ...prev.communityState,
                                selectedCommunity: community,
                            },
                        })),
                    onPostVote,
                    onPostComment,
                    onPostCommentVote,
                },
                communityState: {
                    ...communityState.communityState,
                    communityPostPagination: {
                        state: communityPostPaginationInput,
                        onNext: () =>
                            setCommunityPostPaginationInput((prev) => ({
                                ...prev,
                                page: prev.page + 1,
                            })),
                    },
                    communityPostCommentPaginations:
                        communityPostCommentPaginationInputs.map((input) => ({
                            state: input,
                            onNext: () => {
                                setCommunityPostCommentPaginationInputs(
                                    (prev) =>
                                        prev.map((item) =>
                                            item.postId !== input.postId
                                                ? item
                                                : {
                                                      ...item,
                                                      inputState: {
                                                          ...item.inputState,
                                                          page:
                                                              item.inputState
                                                                  .page + 1,
                                                      },
                                                  }
                                        )
                                );
                                setSelectedPostId(input.postId);
                            },
                        })),
                },
            }}
        >
            {children}
        </CommunityContext.Provider>
    );
};
