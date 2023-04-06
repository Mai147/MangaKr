import { firebaseRoute } from "@/constants/firebaseRoutes";
import { toastOption } from "@/constants/toast";
import { POST_PAGE_COUNT } from "@/constants/pagination";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import usePagination, {
    defaultPaginationInput,
    DocPosition,
    PaginationInput,
} from "@/hooks/usePagination";
import { Comment } from "@/models/Comment";
import { Community } from "@/models/Community";
import { Post } from "@/models/Post";
import { UserModel } from "@/models/User";
import { PostVote, Vote } from "@/models/Vote";
import CommentService from "@/services/CommentService";
import VoteService from "@/services/VoteService";
import { useToast } from "@chakra-ui/react";
import { createContext, useEffect, useState } from "react";
import PostService from "@/services/PostService";

type CommentData = {
    comment: Comment;
    voteValue?: Vote;
    replyComments?: CommentData[];
};

type PostCommentPaginationInput = {
    postId: string;
    inputState: CommentPaginationInput;
};

type ReplyCommentPaginationInput = {
    postId: string;
    commentId: string;
    inputState: CommentPaginationInput;
};

type PostPaginationInput = {
    community: {
        comment: PostCommentPaginationInput[];
        replyComment: ReplyCommentPaginationInput[];
        post: PaginationInput;
    };
    user: {
        comment: PostCommentPaginationInput[];
        replyComment: ReplyCommentPaginationInput[];
        post: PaginationInput;
    };
};

interface CommentPaginationInput extends PaginationInput {
    docValue?: DocPosition;
}

export type PostItemState = {
    post: Post;
    voteValue?: PostVote;
    commentData: CommentData[];
};

type PostState = {
    selected: {
        community?: Community;
        user?: UserModel;
    };
    postList: {
        community: PostItemState[];
        user: PostItemState[];
    };
    paginationInput: PostPaginationInput;
    field?: "user" | "community";
};

interface PostTypeAction {
    loadMorePost: () => void;
    vote: (vote: PostVote, postId: string) => Promise<void>;
    delete: (post: Post) => Promise<void>;
    comment: (commentText: string, postId: string) => Promise<void>;
    loadMoreComment: (postId: string) => void;
    voteComment: (
        vote: Vote,
        commentId: string,
        postId: string,
        isReply?: {
            parentId: string;
        }
    ) => Promise<void>;
    replyComment: (
        commentText: string,
        postId: string,
        commentId: string
    ) => Promise<void>;
    loadMoreReplyComment: (commentId: string, postId: string) => void;
    deleteComment: (
        comment: Comment,
        postId: string,
        isReply?: { parentId: string }
    ) => Promise<void>;
}

interface PostTypeUserAction extends PostTypeAction {
    setSelected: (user: UserModel) => void;
}

interface PostTypeCommunityAction extends PostTypeAction {
    setSelected: (community: Community) => void;
}

type PostAction = {
    user: PostTypeUserAction;
    community: PostTypeCommunityAction;
};

type PostContextState = {
    postState: PostState;
    postAction: PostAction;
};

const defaultPostPaginationInput: PostPaginationInput = {
    user: {
        post: {
            ...defaultPaginationInput,
            pageCount: POST_PAGE_COUNT,
        },
        comment: [],
        replyComment: [],
    },
    community: {
        post: {
            ...defaultPaginationInput,
            pageCount: POST_PAGE_COUNT,
        },
        comment: [],
        replyComment: [],
    },
};

const defaultPostState: PostState = {
    postList: {
        community: [],
        user: [],
    },
    paginationInput: defaultPostPaginationInput,
    selected: {},
};

const defaultPostTypeAction: PostTypeAction = {
    loadMorePost: () => {},
    loadMoreComment: () => {},
    vote: async () => {},
    delete: async () => {},
    comment: async () => {},
    voteComment: async () => {},
    replyComment: async () => {},
    loadMoreReplyComment: () => {},
    deleteComment: async () => {},
};

const defaultPostTypeUserAction: PostTypeUserAction = {
    ...defaultPostTypeAction,
    setSelected: () => {},
};

const defaultPostTypeCommunityAction: PostTypeCommunityAction = {
    ...defaultPostTypeAction,
    setSelected: () => {},
};

const defaultPostContextState: PostContextState = {
    postState: defaultPostState,
    postAction: {
        user: defaultPostTypeUserAction,
        community: defaultPostTypeCommunityAction,
    },
};

export const PostContext = createContext<PostContextState>(
    defaultPostContextState
);

export const PostProvider = ({ children }: any) => {
    const { user } = useAuth();
    const [postState, setPostState] = useState<PostState>(defaultPostState);
    const [postPaginationInput, setPostPaginationInput] =
        useState<PostPaginationInput>(defaultPostPaginationInput);
    const [selectedPostId, setSelectedPostId] = useState<string | undefined>();
    const [selectedCommentId, setSelectedCommentId] = useState<
        string | undefined
    >();
    const { getPosts, getComments } = usePagination();
    const { toggleView } = useModal();
    const toast = useToast();

    const getReplyCommentList = async (commentId: string, postId: string) => {
        if (postState.field) {
            const input = postPaginationInput[
                postState.field
            ].replyComment.find((item) => item.commentId === commentId);
            let commentInput: CommentPaginationInput = {
                ...defaultPaginationInput,
                pageCount: 3,
            };
            if (input) {
                commentInput = input.inputState;
            }
            if (!input) {
                setPostPaginationInput((prev) => ({
                    ...prev,
                    [postState.field!]: {
                        ...prev[postState.field!],
                        replyComment: [
                            ...prev[postState.field!].replyComment,
                            {
                                postId,
                                commentId,
                                inputState: {
                                    ...commentInput,
                                    loading: true,
                                },
                            },
                        ],
                    },
                }));
            } else {
                setPostPaginationInput((prev) => ({
                    ...prev,
                    [postState.field!]: {
                        ...prev[postState.field!],
                        replyComment: prev[postState.field!].replyComment.map(
                            (item) =>
                                item.commentId !== commentId
                                    ? item
                                    : {
                                          ...item,
                                          inputState: {
                                              ...item.inputState,
                                              loading: true,
                                          },
                                      }
                        ),
                    },
                }));
                commentInput = input.inputState;
            }
            const {
                page,
                pageCount,
                isNext,
                isFirst,
                docValue,
                exceptionCount,
            } = commentInput;
            const commentRoute = postState.selected.user
                ? firebaseRoute.getUserPostCommentRoute(
                      postState.selected.user.uid,
                      postId
                  )
                : firebaseRoute.getCommunityPostCommentRoute(
                      postState.selected.community?.id!,
                      postId
                  );
            const res = await getComments({
                page,
                pageCount,
                isFirst,
                isNext,
                docValue,
                exceptionCount,
                commentRoute: firebaseRoute.getReplyCommentRoute(
                    commentRoute,
                    commentId
                ),
            });
            let commentDatas: CommentData[] = [];
            for (const e of res.comments) {
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
            setPostPaginationInput((prev) => ({
                ...prev,
                [postState.field!]: {
                    ...prev[postState.field!],
                    replyComment: prev[postState.field!].replyComment.map(
                        (item) =>
                            item.commentId !== commentId
                                ? item
                                : {
                                      ...item,
                                      inputState: {
                                          ...item.inputState,
                                          totalPage: res?.totalPage || 0,
                                          loading: false,
                                          isFirst: false,
                                          docValue: res.docValue,
                                      },
                                  }
                    ),
                },
            }));

            return commentDatas;
        }
    };

    const getPostComments = async (postId: string) => {
        if (postState.field) {
            const input = postPaginationInput[postState.field].comment.find(
                (item) => item.postId === postId
            );
            let commentInput: CommentPaginationInput = {
                ...defaultPaginationInput,
                pageCount: 3,
            };
            if (input) {
                commentInput = input.inputState;
            }
            if (!input) {
                setPostPaginationInput((prev) => ({
                    ...prev,
                    [postState.field!]: {
                        ...prev[postState.field!],
                        comment: [
                            ...prev[postState.field!].comment,
                            {
                                postId,
                                inputState: {
                                    ...commentInput,
                                    loading: true,
                                },
                            },
                        ],
                    },
                }));
            } else {
                setPostPaginationInput((prev) => ({
                    ...prev,
                    [postState.field!]: {
                        ...prev[postState.field!],
                        comment: prev[postState.field!].comment.map((item) =>
                            item.postId !== postId
                                ? item
                                : {
                                      ...item,
                                      inputState: {
                                          ...item.inputState,
                                          loading: true,
                                      },
                                  }
                        ),
                    },
                }));
                commentInput = input.inputState;
            }
            const {
                page,
                pageCount,
                isNext,
                isFirst,
                docValue,
                exceptionCount,
            } = commentInput;
            const res = await getComments({
                page,
                pageCount,
                isFirst,
                isNext,
                docValue,
                exceptionCount,
                commentRoute: postState.selected.user
                    ? firebaseRoute.getUserPostCommentRoute(
                          postState.selected.user.uid,
                          postId
                      )
                    : firebaseRoute.getCommunityPostCommentRoute(
                          postState.selected.community?.id!,
                          postId
                      ),
            });
            let commentDatas: CommentData[] = [];
            for (const e of res.comments) {
                const replyCommentData = await getReplyCommentList(
                    e.id!,
                    postId
                );
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
            setPostPaginationInput((prev) => ({
                ...prev,
                [postState.field!]: {
                    ...prev[postState.field!],
                    comment: prev[postState.field!].comment.map((item) =>
                        item.postId !== postId
                            ? item
                            : {
                                  ...item,
                                  inputState: {
                                      ...item.inputState,
                                      totalPage: res?.totalPage || 0,
                                      loading: false,
                                      isFirst: false,
                                      docValue: res.docValue,
                                  },
                              }
                    ),
                },
            }));

            return commentDatas;
        }
    };

    const updateListComment = async (postId: string) => {
        const res = await getPostComments(postId);
        if (res) {
            setPostState((prev) => ({
                ...prev,
                postList: {
                    ...prev.postList,
                    [prev.field!]: prev.postList[prev.field!].map((item) =>
                        item.post.id !== postId
                            ? item
                            : {
                                  ...item,
                                  commentData: [...item.commentData, ...res],
                              }
                    ),
                },
            }));
        }
        setSelectedPostId(undefined);
    };

    const updateListReplyComment = async (
        commentId: string,
        postId: string
    ) => {
        const res = await getReplyCommentList(commentId, postId);
        if (res) {
            setPostState((prev) => ({
                ...prev,
                postList: {
                    ...prev.postList,
                    [prev.field!]: prev.postList[prev.field!].map((item) =>
                        item.post.id !== postId
                            ? item
                            : {
                                  ...item,
                                  commentData: item.commentData.map((item) =>
                                      item.comment.id !== commentId
                                          ? item
                                          : {
                                                ...item,
                                                replyComments: [
                                                    ...(item.replyComments ||
                                                        []),
                                                    ...res,
                                                ],
                                            }
                                  ),
                              }
                    ),
                },
            }));
        }
        setSelectedCommentId(undefined);
        setSelectedPostId(undefined);
    };

    const getPostData = async (post: Post) => {
        let postVote;
        const commentData = await getPostComments(post.id!);
        if (user) {
            postVote = await VoteService.get({
                voteRoute: firebaseRoute.getUserPostVoteRoute(user.uid),
                voteId: post.id!,
            });
        }
        const postItem: PostItemState = {
            post,
            voteValue: postVote,
            commentData: commentData || [],
        };
        return postItem;
    };

    const getListPosts = async () => {
        setPostPaginationInput((prev) => ({
            ...prev,
            [postState.field!]: {
                ...prev[postState.field!],
                post: {
                    ...prev[postState.field!].post,
                    loading: true,
                },
            },
        }));
        const res = await getPosts({
            ...postPaginationInput[postState.field!].post,
            userId: postState.selected.user
                ? postState.selected.user.uid
                : undefined,
            communityId: postState.selected.community
                ? postState.selected.community.id!
                : undefined,
        });
        if (res.posts) {
            let postItems: PostItemState[] = [];
            for (const post of res.posts) {
                const postItem = await getPostData(post);
                postItems.push(postItem);
            }
            setPostState((prev) => ({
                ...prev,
                postList: {
                    ...prev.postList,
                    [postState.field!]: [
                        ...prev.postList[postState.field!],
                        ...postItems,
                    ],
                },
            }));
        }
        setPostPaginationInput((prev) => ({
            ...prev,
            [postState.field!]: {
                ...prev[postState.field!],
                post: {
                    ...prev[postState.field!].post,
                    loading: false,
                    isFirst: false,
                    totalPage: res.totalPage || 0,
                },
            },
        }));
    };

    const handleVotePost = async (
        vote: PostVote,
        postId: string,
        type: "user" | "community"
    ) => {
        if (!user) {
            toggleView("login");
        } else {
            try {
                const { value } = vote;
                const userPostVote =
                    type === "user"
                        ? postState.postList.user.find(
                              (item) => item.post.id === postId
                          )?.voteValue
                        : postState.postList.community.find(
                              (item) => item.post.id === postId
                          )?.voteValue;
                if (!userPostVote) {
                    await VoteService.create({
                        voteRoute: firebaseRoute.getUserPostVoteRoute(user.uid),
                        rootRoute:
                            type === "user"
                                ? firebaseRoute.getUserPostRoute(
                                      postState.selected.user!.uid
                                  )
                                : firebaseRoute.getCommunityPostRoute(
                                      postState.selected.community?.id!
                                  ),
                        rootId: postId,
                        voteId: postId,
                        vote,
                    });
                } else {
                    await VoteService.update({
                        voteRoute: firebaseRoute.getUserPostVoteRoute(user.uid),
                        rootRoute:
                            type === "user"
                                ? firebaseRoute.getUserPostRoute(
                                      postState.selected.user!.uid
                                  )
                                : firebaseRoute.getCommunityPostRoute(
                                      postState.selected.community?.id!
                                  ),
                        rootId: postId,
                        voteId: postId,
                        userVote: userPostVote,
                        vote,
                    });
                }
                const changing = value === userPostVote?.value ? -2 : -1;
                setPostState((prev) => ({
                    ...prev,
                    postList: {
                        ...prev.postList,
                        [type]: prev.postList[type].map((item) =>
                            item.post.id !== postId
                                ? item
                                : {
                                      ...item,
                                      post: {
                                          ...item.post,
                                          [vote.field]:
                                              item.post[vote.field] + 1,
                                      },
                                      voteValue:
                                          value === userPostVote?.value
                                              ? undefined
                                              : vote,
                                  }
                        ),
                    },
                }));
                if (userPostVote && Object.keys(userPostVote).length !== 0) {
                    setPostState((prev) => ({
                        ...prev,
                        [type]: prev.postList[type].map((item) =>
                            item.post.id !== postId
                                ? item
                                : {
                                      ...item,
                                      post: {
                                          ...item.post,
                                          [userPostVote.field]:
                                              item.post[userPostVote.field] +
                                              changing,
                                      },
                                  }
                        ),
                    }));
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleCommentPost = async (commentText: string, postId: string) => {
        if (!user) {
            toggleView("login");
            return;
        }
        try {
            const selected = postState.selected;
            const res = await CommentService.create({
                user,
                commentText,
                commentRoute: selected.user
                    ? firebaseRoute.getUserPostCommentRoute(
                          selected.user.uid,
                          postId
                      )
                    : firebaseRoute.getCommunityPostCommentRoute(
                          selected.community?.id!,
                          postId
                      ),
                rootRoute: selected.user
                    ? firebaseRoute.getUserPostRoute(selected.user.uid)
                    : firebaseRoute.getCommunityPostRoute(
                          selected.community?.id!
                      ),
                rootId: postId,
            });
            setPostState((prev) => ({
                ...prev,
                postList: {
                    user: selected.user
                        ? prev.postList.user.map((postData) =>
                              postData.post.id !== postId
                                  ? postData
                                  : {
                                        ...postData,
                                        post: {
                                            ...postData.post,
                                            numberOfComments:
                                                postData.post.numberOfComments +
                                                1,
                                        },
                                        commentData: [
                                            {
                                                comment: res!,
                                            },
                                            ...postData.commentData,
                                        ],
                                    }
                          )
                        : prev.postList.user,
                    community: selected.community
                        ? prev.postList.community.map((postData) =>
                              postData.post.id !== postId
                                  ? postData
                                  : {
                                        ...postData,
                                        post: {
                                            ...postData.post,
                                            numberOfComments:
                                                postData.post.numberOfComments +
                                                1,
                                        },
                                        commentData: [
                                            {
                                                comment: res!,
                                            },
                                            ...postData.commentData,
                                        ],
                                    }
                          )
                        : prev.postList.community,
                },
            }));
            setPostPaginationInput((prev) => ({
                ...prev,
                [postState.field!]: {
                    ...prev[postState.field!],
                    comment: prev[postState.field!].comment.map((item) =>
                        item.postId !== postId
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
                },
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeletePost = async (post: Post) => {
        if (!user || user.uid !== post.creatorId) {
            toast({
                ...toastOption,
                title: "Không thể xóa bài viết này!",
            });
            return;
        }
        try {
            await PostService.delete({
                post,
                community: postState.selected.community,
            });
            setPostState((prev) => ({
                ...prev,
                postList: {
                    ...prev.postList,
                    [postState.field!]: prev.postList[postState.field!].filter(
                        (item) => item.post.id !== post.id
                    ),
                },
                paginationInput: {
                    ...prev.paginationInput,
                    [postState.field!]: {
                        ...prev.paginationInput[postState.field!],
                        post: {
                            ...prev.paginationInput[postState.field!].post,
                            exceptionCount:
                                (prev.paginationInput[postState.field!].post
                                    .exceptionCount || 0) - 1,
                        },
                    },
                },
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const handleVoteComment = async (
        vote: Vote,
        commentId: string,
        postId: string,
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
                const commentDatas = postState.postList[postState.field!].find(
                    (item) => item.post.id === postId
                )?.commentData;

                const userVote = isReply
                    ? commentDatas
                          ?.find(
                              (item) => item.comment.id === isReply?.parentId
                          )
                          ?.replyComments?.find(
                              (item) => item.comment.id === commentId
                          )?.voteValue
                    : commentDatas?.find(
                          (item) => item.comment.id === commentId
                      )?.voteValue;
                const changing = value === userVote?.value ? -2 : -1;
                if (isReply) {
                    const parentCommentRoute = postState.selected.user
                        ? firebaseRoute.getUserPostCommentRoute(
                              postState.selected.user.uid,
                              postId
                          )
                        : firebaseRoute.getCommunityPostCommentRoute(
                              postState.selected.community?.id!,
                              postId
                          );
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
                    setPostState((prev) => ({
                        ...prev,
                        postList: {
                            ...prev.postList,
                            [postState.field!]: prev.postList[
                                postState.field!
                            ].map((item) =>
                                item.post.id !== postId
                                    ? item
                                    : {
                                          ...item,
                                          commentData: item.commentData.map(
                                              (item) =>
                                                  item.comment.id !==
                                                  isReply.parentId
                                                      ? item
                                                      : {
                                                            ...item,
                                                            replyComments:
                                                                item.replyComments?.map(
                                                                    (item) =>
                                                                        item
                                                                            .comment
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
                                      }
                            ),
                        },
                    }));
                    if (userVote && Object.keys(userVote).length !== 0) {
                        setPostState((prev) => ({
                            ...prev,
                            postList: {
                                ...prev.postList,
                                [postState.field!]: prev.postList[
                                    postState.field!
                                ].map((item) =>
                                    item.post.id !== postId
                                        ? item
                                        : {
                                              ...item,
                                              commentData: item.commentData.map(
                                                  (item) =>
                                                      item.comment.id !==
                                                      isReply.parentId
                                                          ? item
                                                          : {
                                                                ...item,
                                                                replyComments:
                                                                    item.replyComments?.map(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item
                                                                                .comment
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
                            rootRoute: postState.selected.user
                                ? firebaseRoute.getUserPostCommentRoute(
                                      postState.selected.user.uid,
                                      postId
                                  )
                                : firebaseRoute.getCommunityPostCommentRoute(
                                      postState.selected.community?.id!,
                                      postId
                                  ),
                            voteId: commentId,
                            rootId: commentId,
                            vote,
                        });
                    } else {
                        await VoteService.update({
                            voteRoute: firebaseRoute.getUserCommentVoteRoute(
                                user.uid
                            ),
                            rootRoute: postState.selected.user
                                ? firebaseRoute.getUserPostCommentRoute(
                                      postState.selected.user.uid,
                                      postId
                                  )
                                : firebaseRoute.getCommunityPostCommentRoute(
                                      postState.selected.community?.id!,
                                      postId
                                  ),
                            voteId: commentId,
                            rootId: commentId,
                            vote,
                            userVote,
                        });
                    }
                    setPostState((prev) => ({
                        ...prev,
                        postList: {
                            ...prev.postList,
                            [postState.field!]: prev.postList[
                                postState.field!
                            ].map((item) =>
                                item.post.id !== postId
                                    ? item
                                    : {
                                          ...item,
                                          commentData: item.commentData.map(
                                              (item) =>
                                                  item.comment.id !== commentId
                                                      ? item
                                                      : {
                                                            comment: {
                                                                ...item.comment,
                                                                [vote.field]:
                                                                    item
                                                                        .comment[
                                                                        vote
                                                                            .field
                                                                    ] + 1,
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
                        setPostState((prev) => ({
                            ...prev,
                            postList: {
                                ...prev.postList,
                                [postState.field!]: prev.postList[
                                    postState.field!
                                ].map((item) =>
                                    item.post.id !== postId
                                        ? item
                                        : {
                                              ...item,
                                              commentData: item.commentData.map(
                                                  (item) =>
                                                      item.comment.id !==
                                                      commentId
                                                          ? item
                                                          : {
                                                                ...item,
                                                                comment: {
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
                }

                // const userVote = postState.postList[postState.field!]
                //     .find((item) => item.post.id === postId)
                //     ?.commentData.find(
                //         (item) => item.comment.id === commentId
                //     )?.voteValue;
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleReplyComment = async (
        commentText: string,
        postId: string,
        commentId: string
    ) => {
        if (!user) {
            toggleView("login");
            return;
        }
        try {
            const commentRoute = postState.selected.user
                ? firebaseRoute.getUserPostCommentRoute(
                      postState.selected.user.uid,
                      postId
                  )
                : firebaseRoute.getCommunityPostCommentRoute(
                      postState.selected.community?.id!,
                      postId
                  );
            const res = await CommentService.create({
                user,
                commentText,
                commentRoute: firebaseRoute.getReplyCommentRoute(
                    commentRoute,
                    commentId
                ),
                rootRoute: postState.selected.user
                    ? firebaseRoute.getUserPostRoute(
                          postState.selected.user.uid
                      )
                    : firebaseRoute.getCommunityPostRoute(
                          postState.selected.community?.id!
                      ),
                rootId: postId,
                reply: {
                    parentId: commentId,
                    parentRoute: commentRoute,
                },
            });
            if (res) {
                setPostState((prev) => ({
                    ...prev,
                    postList: {
                        ...prev.postList,
                        [postState.field!]: prev.postList[postState.field!].map(
                            (item) =>
                                item.post.id !== postId
                                    ? item
                                    : {
                                          ...item,
                                          commentData: item.commentData.map(
                                              (item) =>
                                                  item.comment.id !== commentId
                                                      ? item
                                                      : {
                                                            ...item,
                                                            comment: {
                                                                ...item.comment,
                                                                numberOfReplies:
                                                                    item.comment
                                                                        .numberOfReplies +
                                                                    1,
                                                            },
                                                            replyComments: [
                                                                {
                                                                    comment:
                                                                        res,
                                                                },
                                                                ...(item.replyComments ||
                                                                    []),
                                                            ],
                                                        }
                                          ),
                                      }
                        ),
                    },
                    paginationInput: {
                        ...prev.paginationInput,
                        [postState.field!]: {
                            ...prev.paginationInput[postState.field!],
                            replyComment: prev.paginationInput[
                                postState.field!
                            ].replyComment.map((item) =>
                                item.commentId !== commentId
                                    ? item
                                    : {
                                          ...item,
                                          inputState: {
                                              ...item.inputState,
                                              exceptionCount:
                                                  (item.inputState
                                                      .exceptionCount || 0) + 1,
                                          },
                                      }
                            ),
                        },
                    },
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteComment = async (
        comment: Comment,
        postId: string,
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
            const commentRoute = postState.selected.user
                ? firebaseRoute.getUserPostCommentRoute(
                      postState.selected.user.uid,
                      postId
                  )
                : firebaseRoute.getCommunityPostCommentRoute(
                      postState.selected.community?.id!,
                      postId
                  );
            const rootRoute = postState.selected.user
                ? firebaseRoute.getUserPostRoute(postState.selected.user.uid)
                : firebaseRoute.getCommunityPostRoute(
                      postState.selected.community?.id!
                  );

            const res = await CommentService.delete({
                commentRoute: isReply
                    ? firebaseRoute.getReplyCommentRoute(
                          commentRoute,
                          isReply.parentId
                      )
                    : commentRoute,
                rootRoute,
                rootId: postId,
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
                    setPostState((prev) => ({
                        ...prev,
                        postList: {
                            ...prev.postList,
                            [postState.field!]: prev.postList[
                                postState.field!
                            ].map((item) =>
                                item.post.id !== postId
                                    ? item
                                    : {
                                          ...item,
                                          post: {
                                              ...item.post,
                                              numberOfComments:
                                                  item.post.numberOfComments -
                                                  res,
                                          },
                                          commentData: item.commentData.map(
                                              (item) =>
                                                  item.comment.id !==
                                                  isReply.parentId
                                                      ? item
                                                      : {
                                                            ...item,
                                                            replyComments:
                                                                item.replyComments?.filter(
                                                                    (item) =>
                                                                        item
                                                                            .comment
                                                                            .id !==
                                                                        comment.id
                                                                ),
                                                        }
                                          ),
                                      }
                            ),
                        },
                        paginationInput: {
                            ...prev.paginationInput,
                            [postState.field!]: {
                                ...prev.paginationInput[postState.field!],
                                replyComment: prev.paginationInput[
                                    postState.field!
                                ].replyComment.map((item) =>
                                    item.commentId !== isReply.parentId
                                        ? item
                                        : {
                                              ...item,
                                              inputState: {
                                                  ...item.inputState,
                                                  exceptionCount:
                                                      (item.inputState
                                                          .exceptionCount ||
                                                          0) - 1,
                                              },
                                          }
                                ),
                            },
                        },
                    }));
                } else {
                    setPostState((prev) => ({
                        ...prev,
                        postList: {
                            ...prev.postList,
                            [postState.field!]: prev.postList[
                                postState.field!
                            ].map((item) =>
                                item.post.id !== postId
                                    ? item
                                    : {
                                          ...item,
                                          post: {
                                              ...item.post,
                                              numberOfComments:
                                                  item.post.numberOfComments -
                                                  res,
                                          },
                                          commentData: item.commentData.filter(
                                              (item) =>
                                                  item.comment.id !== comment.id
                                          ),
                                      }
                            ),
                        },
                        paginationInput: {
                            ...prev.paginationInput,
                            [postState.field!]: {
                                ...prev.paginationInput[postState.field!],
                                comment: prev.paginationInput[
                                    postState.field!
                                ].comment.map((item) =>
                                    item.postId !== postId
                                        ? item
                                        : {
                                              ...item,
                                              inputState: {
                                                  ...item.inputState,
                                                  exceptionCount:
                                                      (item.inputState
                                                          .exceptionCount ||
                                                          0) - 1,
                                              },
                                          }
                                ),
                            },
                        },
                    }));
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (postState.selected.user) {
            setPostState((prev) => ({
                ...prev,
                field: "user",
            }));
            setPostPaginationInput((prev) => ({
                ...prev,
                user: {
                    ...prev.user,
                    post: {
                        ...defaultPaginationInput,
                        pageCount: POST_PAGE_COUNT,
                        userId: postState.selected.user!.uid,
                    },
                },
            }));
        } else {
            setPostPaginationInput((prev) => ({
                ...prev,
                user: defaultPostPaginationInput.user,
            }));
        }
        setPostState((prev) => ({
            ...prev,
            postList: {
                ...prev.postList,
                user: [],
            },
        }));
    }, [postState.selected.user]);

    useEffect(() => {
        if (postState.selected.community) {
            setPostState((prev) => ({
                ...prev,
                field: "community",
            }));
            setPostPaginationInput((prev) => ({
                ...prev,
                community: {
                    ...prev.community,
                    post: {
                        ...defaultPaginationInput,
                        pageCount: POST_PAGE_COUNT,
                        communityId: postState.selected.community?.id,
                    },
                },
            }));
        } else {
            setPostPaginationInput((prev) => ({
                ...prev,
                community: defaultPostPaginationInput.community,
            }));
        }
        setPostState((prev) => ({
            ...prev,
            postList: {
                ...prev.postList,
                community: [],
            },
        }));
    }, [postState.selected.community]);

    useEffect(() => {
        if (postState.field) {
            getListPosts();
        }
    }, [
        postState.field,
        postState.selected,
        postPaginationInput.user.post.page,
        postPaginationInput.community.post.page,
    ]);

    useEffect(() => {
        if (postState.field && selectedPostId) {
            if (selectedCommentId) {
                updateListReplyComment(selectedCommentId, selectedPostId);
            } else {
                updateListComment(selectedPostId);
            }
        }
    }, [postState.field, selectedCommentId, selectedPostId]);

    return (
        <PostContext.Provider
            value={{
                postState: {
                    ...postState,
                    paginationInput: postPaginationInput,
                },
                postAction: {
                    user: {
                        setSelected: (user) => {
                            setPostState((prev) => ({
                                ...prev,
                                selected: {
                                    ...prev.selected,
                                    user,
                                },
                            }));
                        },
                        loadMorePost: () => {
                            setPostPaginationInput((prev) => ({
                                ...prev,
                                user: {
                                    ...prev.user,
                                    page: prev.user.post.page + 1,
                                    isNext: true,
                                },
                            }));
                        },
                        vote: async (vote, postId) => {
                            await handleVotePost(vote, postId, "user");
                        },
                        delete: handleDeletePost,
                        comment: handleCommentPost,
                        loadMoreComment: (postId) => {
                            setPostPaginationInput((prev) => ({
                                ...prev,
                                user: {
                                    ...prev.user,
                                    comment: prev.user.comment.map((item) =>
                                        item.postId !== postId
                                            ? item
                                            : {
                                                  ...item,
                                                  inputState: {
                                                      ...item.inputState,
                                                      page:
                                                          item.inputState.page +
                                                          1,
                                                      isNext: true,
                                                  },
                                              }
                                    ),
                                },
                            }));
                            setSelectedPostId(postId);
                        },
                        voteComment: handleVoteComment,
                        replyComment: handleReplyComment,
                        loadMoreReplyComment: (commentId, postId) => {
                            setPostPaginationInput((prev) => ({
                                ...prev,
                                user: {
                                    ...prev.user,
                                    replyComment: prev.user.replyComment.map(
                                        (item) =>
                                            item.commentId !== commentId
                                                ? item
                                                : {
                                                      ...item,
                                                      inputState: {
                                                          ...item.inputState,
                                                          page:
                                                              item.inputState
                                                                  .page + 1,
                                                          isNext: true,
                                                      },
                                                  }
                                    ),
                                },
                            }));
                            setSelectedCommentId(commentId);
                            setSelectedPostId(postId);
                        },
                        deleteComment: handleDeleteComment,
                    },
                    community: {
                        setSelected: (community) =>
                            setPostState((prev) => ({
                                ...prev,
                                selected: {
                                    ...prev.selected,
                                    community,
                                },
                            })),
                        loadMorePost: () => {
                            setPostPaginationInput((prev) => ({
                                ...prev,
                                community: {
                                    ...prev.community,
                                    page: prev.community.post.page + 1,
                                    isNext: true,
                                },
                            }));
                        },
                        vote: async (vote, postId) => {
                            await handleVotePost(vote, postId, "community");
                        },
                        delete: handleDeletePost,
                        comment: handleCommentPost,
                        loadMoreComment: (postId) => {
                            setPostPaginationInput((prev) => ({
                                ...prev,
                                community: {
                                    ...prev.community,
                                    comment: prev.community.comment.map(
                                        (item) =>
                                            item.postId !== postId
                                                ? item
                                                : {
                                                      ...item,
                                                      inputState: {
                                                          ...item.inputState,
                                                          page:
                                                              item.inputState
                                                                  .page + 1,
                                                          isNext: true,
                                                      },
                                                  }
                                    ),
                                },
                            }));
                            setSelectedPostId(postId);
                        },
                        voteComment: handleVoteComment,
                        replyComment: handleReplyComment,
                        loadMoreReplyComment: (commentId, postId) => {
                            setPostPaginationInput((prev) => ({
                                ...prev,
                                community: {
                                    ...prev.community,
                                    replyComment:
                                        prev.community.replyComment.map(
                                            (item) =>
                                                item.commentId !== commentId
                                                    ? item
                                                    : {
                                                          ...item,
                                                          inputState: {
                                                              ...item.inputState,
                                                              page:
                                                                  item
                                                                      .inputState
                                                                      .page + 1,
                                                              isNext: true,
                                                          },
                                                      }
                                        ),
                                },
                            }));
                            setSelectedCommentId(commentId);
                            setSelectedPostId(postId);
                        },
                        deleteComment: handleDeleteComment,
                    },
                },
            }}
        >
            {children}
        </PostContext.Provider>
    );
};
