import { firebaseRoute } from "@/constants/firebaseRoutes";
import { toastOption } from "@/constants/toast";
import useModal from "@/hooks/useModal";
import { Comment } from "@/models/Comment";
import { Vote } from "@/models/Vote";
import CommentService from "@/services/CommentService";
import VoteService from "@/services/VoteService";
import { useToast } from "@chakra-ui/react";
import { createContext, useEffect, useRef, useState } from "react";
import useTestPagination, {
    CommentPaginationInput,
    defaultPaginationInput,
} from "@/hooks/useTestPagination";
import { COMMENT_PAGE_COUNT } from "@/constants/pagination";
import useAuth from "@/hooks/useAuth";

type CommentData = {
    comment: Comment;
    voteValue?: Vote;
    replyComments?: CommentData[];
};

type ReplyCommentPaginationInput = {
    commentId: string;
    inputState: CommentPaginationInput;
};

type CommentState = {
    commentPaginationOutput: {
        commentDatas: CommentData[];
        page: number;
        totalPage: number;
    };
    commentPaginationInput: CommentPaginationInput;
    replyCommentPaginationInput: ReplyCommentPaginationInput[];
    replyCommentPaginationOutput: {
        page: number;
        totalPage: number;
        commentId: string;
    }[];
    loading: {
        getComment: boolean;
        getReply: {
            commentId: string;
            loading: boolean;
        }[];
        comment: boolean;
        deleteComment: {
            commentId: string;
            loading: boolean;
        }[];
        reply: {
            commentId: string;
            loading: boolean;
        }[];
    };
};

type CommentAction = {
    loadMore: () => void;
    loadMoreReply: (commentId: string) => void;
    comment: (commentText: string) => Promise<void>;
    vote: (
        vote: Vote,
        commentId: string,
        isReply?: {
            parentId: string;
        }
    ) => Promise<void>;
    reply: (commentText: string, commentId: string) => Promise<void>;
    delete: (comment: Comment, isReply?: { parentId: string }) => Promise<void>;
};

type CommentContextState = {
    commentState: CommentState;
    commentAction: CommentAction;
};

const defaultCommentState: CommentState = {
    commentPaginationInput: {
        ...defaultPaginationInput,
        commentRoute: "",
        pageCount: COMMENT_PAGE_COUNT,
    },
    commentPaginationOutput: {
        commentDatas: [],
        page: 1,
        totalPage: 0,
    },
    replyCommentPaginationInput: [],
    replyCommentPaginationOutput: [],
    loading: {
        comment: false,
        getComment: false,
        getReply: [],
        deleteComment: [],
        reply: [],
    },
};

const defaultCommentAction: CommentAction = {
    loadMore: () => {},
    vote: async () => {},
    delete: async () => {},
    comment: async () => {},
    reply: async () => {},
    loadMoreReply: () => {},
};

const defaultCommentContextState: CommentContextState = {
    commentState: defaultCommentState,
    commentAction: defaultCommentAction,
};

export const CommentContext = createContext<CommentContextState>(
    defaultCommentContextState
);

type CommentProviderProps = {
    children: any;
    commentRoute: string;
    rootRoute: string;
    rootId: string;
    setNumberOfCommentsIncrement: (increment: number) => void;
};

export const CommentProvider = ({
    children,
    commentRoute,
    rootId,
    rootRoute,
    setNumberOfCommentsIncrement,
}: CommentProviderProps) => {
    const { user } = useAuth();
    const [commentState, setCommentState] =
        useState<CommentState>(defaultCommentState);
    const [selectedCommentId, setSelectedCommentId] = useState<
        string | undefined
    >();
    const { getComments } = useTestPagination();
    const { toggleView } = useModal();
    const toast = useToast();

    const getReplyCommentList = async (commentId: string) => {
        setCommentState((prev) => ({
            ...prev,
            loading: {
                ...prev.loading,
                getReply: prev.loading.getReply.map((item) =>
                    item.commentId !== commentId
                        ? item
                        : {
                              ...item,
                              loading: true,
                          }
                ),
            },
        }));
        const input = commentState.replyCommentPaginationInput.find(
            (item) => item.commentId === commentId
        );
        let commentInput: CommentPaginationInput = {
            ...defaultPaginationInput,
            pageCount: 3,
            commentRoute,
            setDocValue: (docValue) => {
                setCommentState((prev) => ({
                    ...prev,
                    replyCommentPaginationInput:
                        prev.replyCommentPaginationInput.map((item) =>
                            item.commentId !== commentId
                                ? item
                                : {
                                      ...item,
                                      inputState: {
                                          ...item.inputState,
                                          docValue,
                                      },
                                  }
                        ),
                }));
            },
        };
        if (input) {
            commentInput = input.inputState;
        }
        const res = await getComments({
            ...commentInput,
            commentRoute: firebaseRoute.getReplyCommentRoute(
                commentRoute,
                commentId
            ),
        });
        let commentDatas: CommentData[] = [];
        if (res) {
            for (const e of res.list) {
                if (user) {
                    const userVote = await VoteService.get({
                        voteRoute: firebaseRoute.getUserCommentVoteRoute(
                            user.uid
                        ),
                        voteId: e.id!,
                    });
                    const commentData: CommentData = {
                        comment: e,
                        voteValue: userVote as Vote,
                    };
                    commentDatas.push(commentData);
                } else {
                    commentDatas.push({ comment: e });
                }
            }
            setCommentState((prev) => ({
                ...prev,
                replyCommentPaginationInput:
                    prev.replyCommentPaginationInput.map((item) =>
                        item.commentId !== commentId
                            ? item
                            : {
                                  ...item,
                                  inputState: {
                                      ...item.inputState,
                                      isFirst: false,
                                  },
                              }
                    ),
                replyCommentPaginationOutput:
                    prev.replyCommentPaginationOutput.map((item) =>
                        item.commentId !== commentId
                            ? item
                            : {
                                  ...item,
                                  page: res.page,
                                  totalPage: res.totalPage,
                              }
                    ),
                loading: {
                    ...prev.loading,
                    getReply: prev.loading.getReply.map((item) =>
                        item.commentId !== commentId
                            ? item
                            : {
                                  ...item,
                                  loading: false,
                              }
                    ),
                },
            }));
        }

        return commentDatas;
    };

    const getListComments = async () => {
        setCommentState((prev) => ({
            ...prev,
            loading: {
                ...prev.loading,
                getComment: true,
            },
        }));
        const res = await getComments({
            ...commentState.commentPaginationInput,
            setDocValue: (docValue) => {
                setCommentState((prev) => ({
                    ...prev,
                    commentPaginationInput: {
                        ...prev.commentPaginationInput,
                        docValue,
                    },
                }));
            },
            commentRoute,
        });
        if (res) {
            let commentDatas: CommentData[] = [];
            for (const e of res.list) {
                const replyCommentData = await getReplyCommentList(e.id!);
                if (user) {
                    const userVote = await VoteService.get({
                        voteRoute: firebaseRoute.getUserCommentVoteRoute(
                            user.uid
                        ),
                        voteId: e.id!,
                    });
                    const commentData: CommentData = {
                        comment: e,
                        voteValue: userVote as Vote,
                        replyComments: replyCommentData,
                    };
                    commentDatas.push(commentData);
                } else {
                    commentDatas.push({
                        comment: e,
                        replyComments: replyCommentData,
                    });
                }
            }
            setCommentState((prev) => ({
                ...prev,
                commentPaginationOutput: {
                    commentDatas: [
                        ...prev.commentPaginationOutput.commentDatas,
                        ...commentDatas,
                    ],
                    page: res.page,
                    totalPage: res.totalPage,
                },
                commentPaginationInput: {
                    ...prev.commentPaginationInput,
                    isFirst: false,
                },
                loading: {
                    ...prev.loading,
                    getComment: false,
                },
            }));
        }
    };

    const updateListReplyComment = async (commentId: string) => {
        const res = await getReplyCommentList(commentId);
        if (res) {
            setCommentState((prev) => ({
                ...prev,
                commentPaginationOutput: {
                    ...prev.commentPaginationOutput,
                    commentDatas: prev.commentPaginationOutput.commentDatas.map(
                        (item) =>
                            item.comment.id !== commentId
                                ? item
                                : {
                                      ...item,
                                      replyComments: [
                                          ...(item.replyComments || []),
                                          ...res,
                                      ],
                                  }
                    ),
                },
            }));
        }
        setSelectedCommentId(undefined);
    };

    const handleComment = async (commentText: string) => {
        if (!user) {
            toggleView("login");
            return;
        }
        try {
            setCommentState((prev) => ({
                ...prev,
                loading: {
                    ...prev.loading,
                    comment: true,
                },
            }));
            const res = await CommentService.create({
                user,
                commentText,
                commentRoute,
                rootRoute,
                rootId,
            });
            if (res) {
                setCommentState((prev) => ({
                    ...prev,
                    commentPaginationOutput: {
                        ...prev.commentPaginationOutput,
                        commentDatas: [
                            {
                                comment: res,
                            },
                            ...prev.commentPaginationOutput.commentDatas,
                        ],
                    },
                    commentPaginationInput: {
                        ...prev.commentPaginationInput,
                        exceptionCount:
                            (prev.commentPaginationInput.exceptionCount || 0) +
                            1,
                    },
                }));
                setNumberOfCommentsIncrement(1);
            }
            setCommentState((prev) => ({
                ...prev,
                loading: {
                    ...prev.loading,
                    comment: false,
                },
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const handleVoteComment = async (
        vote: Vote,
        commentId: string,
        isReply?: {
            parentId: string;
        }
    ) => {
        if (!user) {
            toggleView("login");
            return;
        } else {
            try {
                const { value } = vote;
                const { commentPaginationOutput } = commentState;
                const { commentDatas } = commentPaginationOutput;
                const userVote = isReply
                    ? commentDatas
                          .find((item) => item.comment.id === isReply.parentId)
                          ?.replyComments?.find(
                              (item) => item.comment.id === commentId
                          )?.voteValue
                    : commentDatas.find((item) => item.comment.id === commentId)
                          ?.voteValue;
                const changing = value === userVote?.value ? -2 : -1;
                if (isReply) {
                    const parentCommentRoute = commentRoute;
                    if (!userVote) {
                        await VoteService.create({
                            vote,
                            voteRoute: firebaseRoute.getUserCommentVoteRoute(
                                user.uid
                            ),
                            voteId: commentId!,
                            rootRoute: firebaseRoute.getReplyCommentRoute(
                                parentCommentRoute,
                                isReply.parentId
                            ),
                            rootId: commentId!,
                        });
                    } else {
                        await VoteService.update({
                            vote,
                            voteRoute: firebaseRoute.getUserCommentVoteRoute(
                                user.uid
                            ),
                            voteId: commentId!,
                            rootRoute: firebaseRoute.getReplyCommentRoute(
                                parentCommentRoute,
                                isReply.parentId
                            ),
                            rootId: commentId!,
                            userVote,
                        });
                    }
                    setCommentState((prev) => ({
                        ...prev,
                        commentPaginationOutput: {
                            ...prev.commentPaginationOutput,
                            commentDatas:
                                prev.commentPaginationOutput.commentDatas.map(
                                    (item) =>
                                        item.comment.id !== isReply.parentId
                                            ? item
                                            : {
                                                  ...item,
                                                  replyComments:
                                                      item.replyComments?.map(
                                                          (item) =>
                                                              item.comment
                                                                  .id !==
                                                              commentId
                                                                  ? item
                                                                  : {
                                                                        ...item,
                                                                        comment:
                                                                            {
                                                                                ...item.comment,
                                                                                [vote.field]:
                                                                                    item
                                                                                        .comment[
                                                                                        vote
                                                                                            .field
                                                                                    ] +
                                                                                    1,
                                                                            },
                                                                        voteValue:
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
                    if (userVote && Object.keys(userVote).length !== 0) {
                        setCommentState((prev) => ({
                            ...prev,
                            commentPaginationOutput: {
                                ...prev.commentPaginationOutput,
                                commentDatas:
                                    prev.commentPaginationOutput.commentDatas.map(
                                        (item) =>
                                            item.comment.id !== isReply.parentId
                                                ? item
                                                : {
                                                      ...item,
                                                      replyComments:
                                                          item.replyComments?.map(
                                                              (item) =>
                                                                  item.comment
                                                                      .id !==
                                                                  commentId
                                                                      ? item
                                                                      : {
                                                                            ...item,
                                                                            comment:
                                                                                {
                                                                                    ...item.comment,
                                                                                    [userVote.field]:
                                                                                        item
                                                                                            .comment[
                                                                                            userVote
                                                                                                .field
                                                                                        ] +
                                                                                        changing,
                                                                                },
                                                                        }
                                                          ),
                                                  }
                                    ),
                            },
                        }));
                    }
                } else {
                    if (!userVote) {
                        await VoteService.create({
                            voteRoute: firebaseRoute.getUserCommentVoteRoute(
                                user.uid
                            ),
                            rootRoute: commentRoute,
                            voteId: commentId,
                            rootId: commentId,
                            vote,
                        });
                    } else {
                        await VoteService.update({
                            voteRoute: firebaseRoute.getUserCommentVoteRoute(
                                user.uid
                            ),
                            rootRoute: commentRoute,
                            voteId: commentId,
                            rootId: commentId,
                            vote,
                            userVote,
                        });
                    }
                    setCommentState((prev) => ({
                        ...prev,
                        commentPaginationOutput: {
                            ...prev.commentPaginationOutput,
                            commentDatas:
                                prev.commentPaginationOutput.commentDatas.map(
                                    (item) =>
                                        item.comment.id !== commentId
                                            ? item
                                            : {
                                                  ...item,
                                                  comment: {
                                                      ...item.comment,
                                                      [vote.field]:
                                                          item.comment[
                                                              vote.field
                                                          ] + 1,
                                                  },
                                                  voteValue:
                                                      value === userVote?.value
                                                          ? undefined
                                                          : vote,
                                              }
                                ),
                        },
                    }));
                    if (userVote && Object.keys(userVote).length !== 0) {
                        setCommentState((prev) => ({
                            ...prev,
                            commentPaginationOutput: {
                                ...prev.commentPaginationOutput,
                                commentDatas:
                                    prev.commentPaginationOutput.commentDatas.map(
                                        (item) =>
                                            item.comment.id !== commentId
                                                ? item
                                                : {
                                                      ...item,
                                                      comment: {
                                                          ...item.comment,
                                                          [userVote.field]:
                                                              item.comment[
                                                                  userVote.field
                                                              ] + changing,
                                                      },
                                                  }
                                    ),
                            },
                        }));
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleReplyComment = async (
        commentText: string,
        commentId: string
    ) => {
        if (!user) {
            toggleView("login");
            return;
        }
        try {
            const isExistsLoading = commentState.loading.reply.find(
                (item) => item.commentId === commentId
            );
            setCommentState((prev) => ({
                ...prev,
                loading: {
                    ...prev.loading,
                    reply: isExistsLoading
                        ? prev.loading.reply.map((item) =>
                              item.commentId !== commentId
                                  ? item
                                  : {
                                        ...item,
                                        loading: true,
                                    }
                          )
                        : [
                              ...prev.loading.reply,
                              {
                                  commentId,
                                  loading: true,
                              },
                          ],
                },
            }));
            const res = await CommentService.create({
                user,
                commentText,
                commentRoute: firebaseRoute.getReplyCommentRoute(
                    commentRoute,
                    commentId
                ),
                rootRoute,
                rootId,
                reply: {
                    parentId: commentId,
                    parentRoute: commentRoute,
                },
            });
            if (res) {
                setCommentState((prev) => ({
                    ...prev,
                    commentPaginationOutput: {
                        ...prev.commentPaginationOutput,
                        commentDatas:
                            prev.commentPaginationOutput.commentDatas.map(
                                (item) =>
                                    item.comment.id !== commentId
                                        ? item
                                        : {
                                              ...item,
                                              comment: {
                                                  ...item.comment,
                                                  numberOfReplies:
                                                      item.comment
                                                          .numberOfReplies + 1,
                                              },
                                              replyComments: [
                                                  {
                                                      comment: res,
                                                  },
                                                  ...(item.replyComments || []),
                                              ],
                                          }
                            ),
                    },
                    replyCommentPaginationInput:
                        prev.replyCommentPaginationInput.map((item) =>
                            item.commentId !== commentId
                                ? item
                                : {
                                      ...item,
                                      inputState: {
                                          ...item.inputState,
                                          exceptionCount:
                                              (item.inputState.exceptionCount ||
                                                  0) + 1,
                                      },
                                  }
                        ),
                }));
                setNumberOfCommentsIncrement(1);
            }
            setCommentState((prev) => ({
                ...prev,
                loading: {
                    ...prev.loading,
                    reply: isExistsLoading
                        ? prev.loading.reply.map((item) =>
                              item.commentId !== commentId
                                  ? item
                                  : {
                                        ...item,
                                        loading: false,
                                    }
                          )
                        : [
                              ...prev.loading.reply,
                              {
                                  commentId,
                                  loading: false,
                              },
                          ],
                },
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteComment = async (
        comment: Comment,
        isReply?: { parentId: string }
    ) => {
        if (!user || user.uid !== comment.creatorId) {
            toast({
                ...toastOption,
                title: "Không thể xóa bình luận này!",
            });
            return;
        }
        try {
            setCommentState((prev) => ({
                ...prev,
                loading: {
                    ...prev.loading,
                    deleteComment: prev.loading.deleteComment.map((item) =>
                        item.commentId !== comment.id
                            ? item
                            : {
                                  ...item,
                                  loading: true,
                              }
                    ),
                },
            }));
            const res = await CommentService.delete({
                commentRoute: isReply
                    ? firebaseRoute.getReplyCommentRoute(
                          commentRoute,
                          isReply.parentId
                      )
                    : commentRoute,
                rootRoute,
                rootId,
                commentId: comment.id!,
                reply: isReply
                    ? {
                          parentRoute: commentRoute,
                          parentId: isReply.parentId,
                      }
                    : undefined,
            });
            if (res) {
                if (isReply) {
                    setCommentState((prev) => ({
                        ...prev,
                        commentPaginationOutput: {
                            ...prev.commentPaginationOutput,
                            commentDatas:
                                prev.commentPaginationOutput.commentDatas.map(
                                    (item) =>
                                        item.comment.id !== isReply.parentId
                                            ? item
                                            : {
                                                  ...item,
                                                  replyComments:
                                                      item.replyComments?.filter(
                                                          (item) =>
                                                              item.comment
                                                                  .id !==
                                                              comment.id
                                                      ),
                                              }
                                ),
                        },
                        replyCommentPaginationInput:
                            prev.replyCommentPaginationInput.map((item) =>
                                item.commentId !== isReply.parentId
                                    ? item
                                    : {
                                          ...item,
                                          inputState: {
                                              ...item.inputState,
                                              exceptionCount:
                                                  (item.inputState
                                                      .exceptionCount || 0) - 1,
                                          },
                                      }
                            ),
                    }));
                    setNumberOfCommentsIncrement(res);
                } else {
                    setCommentState((prev) => ({
                        ...prev,
                        commentPaginationOutput: {
                            ...prev.commentPaginationOutput,
                            commentDatas:
                                prev.commentPaginationOutput.commentDatas.filter(
                                    (item) => item.comment.id !== comment.id
                                ),
                        },
                        commentPaginationInput: {
                            ...prev.commentPaginationInput,
                            exceptionCount:
                                (prev.commentPaginationInput.exceptionCount ||
                                    0) - 1,
                        },
                    }));
                }
            }
            setCommentState((prev) => ({
                ...prev,
                loading: {
                    ...prev.loading,
                    deleteComment: prev.loading.deleteComment.map((item) =>
                        item.commentId !== comment.id
                            ? item
                            : {
                                  ...item,
                                  loading: false,
                              }
                    ),
                },
            }));
        } catch (error) {
            console.log(error);
        }
    };

    console.log(commentRoute);

    useEffect(() => {
        setCommentState(defaultCommentState);
    }, [user]);

    useEffect(() => {
        getListComments();
    }, [commentState.commentPaginationInput.page, user]);

    useEffect(() => {
        if (selectedCommentId) {
            updateListReplyComment(selectedCommentId);
        }
    }, [selectedCommentId]);

    useEffect(() => {
        const { commentDatas } = commentState.commentPaginationOutput;
        setCommentState((prev) => ({
            ...prev,
            loading: {
                ...prev.loading,
                getReply: commentDatas.map((item) => ({
                    commentId: item.comment.id!,
                    loading: false,
                })),
                reply: commentDatas.map((item) => ({
                    commentId: item.comment.id!,
                    loading: false,
                })),
                deleteComment: [
                    ...commentDatas.map((item) => ({
                        commentId: item.comment.id!,
                        loading: false,
                    })),
                    ...commentDatas.flatMap((item) => {
                        return (item.replyComments || []).map((item) => ({
                            commentId: item.comment.id!,
                            loading: false,
                        }));
                    }),
                ],
            },
        }));
    }, [commentState.commentPaginationOutput.commentDatas]);

    return (
        <CommentContext.Provider
            value={{
                commentState,
                commentAction: {
                    comment: handleComment,
                    loadMore: () => {
                        setCommentState((prev) => ({
                            ...prev,
                            commentPaginationInput: {
                                ...prev.commentPaginationInput,
                                page: prev.commentPaginationInput.page + 1,
                                isNext: true,
                            },
                        }));
                    },
                    vote: handleVoteComment,
                    reply: handleReplyComment,
                    loadMoreReply: (commentId: string) => {
                        setCommentState((prev) => ({
                            ...prev,
                            replyCommentPaginationInput:
                                prev.replyCommentPaginationInput.map((item) =>
                                    item.commentId !== commentId
                                        ? item
                                        : {
                                              ...item,
                                              inputState: {
                                                  ...item.inputState,
                                                  page:
                                                      item.inputState.page + 1,
                                                  isNext: true,
                                              },
                                          }
                                ),
                        }));
                        setSelectedCommentId(commentId);
                    },
                    delete: handleDeleteComment,
                },
            }}
        >
            {children}
        </CommentContext.Provider>
    );
};
