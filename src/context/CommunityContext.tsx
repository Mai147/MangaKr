import { firebaseRoute } from "@/constants/firebaseRoutes";
import { POST_PAGE_COUNT } from "@/constants/pagination";
import { CommunityRole, COMMUNITY_USER_ROLE } from "@/constants/roles";
import { toastOption } from "@/constants/toast";
import useAuth from "@/hooks/useAuth";
import useDebounce from "@/hooks/useDebounce";
import useModal from "@/hooks/useModal";
import usePagination, {
    defaultPaginationInput,
    PaginationInput,
} from "@/hooks/usePagination";
import { Comment } from "@/models/Comment";
import { Community } from "@/models/Community";
import { CommunityPost } from "@/models/Post";
import { Topic } from "@/models/Topic";
import { PostVote, Vote } from "@/models/Vote";
import CommentService from "@/services/CommentService";
import CommunityService from "@/services/CommunityService";
import VoteService from "@/services/VoteService";
import { validateCreateCommunity } from "@/validation/communityValidation";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

interface CommunityInfoPaginationInput extends PaginationInput {
    communityId: string;
    searchValue?: string;
}

interface CommunityPostCommentPaginationInput {
    postId: string;
    inputState: PaginationInput;
}

const defaultCommunityInfoPaginationInput: CommunityInfoPaginationInput = {
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

interface CommunityInfoPagination {
    state: CommunityInfoPaginationInput;
    onNext: () => void;
    onPrev: () => void;
}

interface CommunityTopicPagination extends CommunityInfoPagination {
    searchValue: string;
    setSearchValue: (searchValue: string) => void;
}

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
    relatedCommunities?: Community[];
    communityPosts?: CommunityPost[];
    communityPostVotes?: CommunityPostVote[];
    communityPostComments?: CommunityPostComment[];
    communityPostPagination?: CommunityInfoPagination;
    communityPostCommentPaginations?: CommunityPostCommentPagination[];
    communityTopics?: Topic[];
    communityTopicPagination?: CommunityTopicPagination;
    userCommunityRole?: {
        isAccept: boolean;
        role?: CommunityRole;
    };
    communityLoading: boolean;
};

type CommunityAction = {
    setSelectedCommunity: (community: Community) => void;
    updateCommunityImage: (imageUrl: string) => Promise<void>;
    updateCommunityName: (name: string) => Promise<void>;
    updateCommunityDescription: (description: string) => Promise<void>;
    joinCommunity: () => Promise<void>;
    leaveCommunity: () => Promise<void>;
    toUserRole: () => Promise<void>;
    onPostVote: (vote: PostVote, postId: string) => Promise<void>;
    onPostComment: (commentText: string, postId: string) => Promise<void>;
    onPostCommentReply: (
        commentText: string,
        postId: string,
        commentId: string
    ) => Promise<Comment | undefined>;
    onPostCommentVote: (
        vote: Vote,
        commentId: string,
        postId: string
    ) => Promise<void>;
    onDeletePostComment: (comment: Comment, postId: string) => Promise<void>;
};

type CommunityContextState = {
    communityState: CommunityState;
    communityAction: CommunityAction;
};

const defaultCommunityState: CommunityState = {
    communityLoading: true,
};

const defaultCommunityContextState: CommunityContextState = {
    communityState: {
        ...defaultCommunityState,
    },
    communityAction: {
        setSelectedCommunity: () => {},
        joinCommunity: async () => {},
        leaveCommunity: async () => {},
        toUserRole: async () => {},
        updateCommunityImage: async () => {},
        updateCommunityName: async () => {},
        updateCommunityDescription: async () => {},
        onPostVote: async () => {},
        onPostComment: async () => {},
        onPostCommentReply: async () => {
            return undefined;
        },
        onPostCommentVote: async () => {},
        onDeletePostComment: async () => {},
    },
};

export const CommunityContext = createContext<CommunityContextState>(
    defaultCommunityContextState
);

export const CommunityProvider = ({ children }: any) => {
    const { toggleView } = useModal();
    const { user } = useAuth();
    const router = useRouter();
    const [communityState, setCommunityState] = useState<CommunityState>(
        defaultCommunityState
    );
    const [communityPostPaginationInput, setCommunityPostPaginationInput] =
        useState<CommunityInfoPaginationInput>(
            defaultCommunityInfoPaginationInput
        );
    const [communityTopicPaginationInput, setCommunityTopicPaginationInput] =
        useState<CommunityInfoPaginationInput>({
            ...defaultCommunityInfoPaginationInput,
        });
    const [
        communityPostCommentPaginationInputs,
        setCommunityPostCommentPaginationInputs,
    ] = useState<CommunityPostCommentPaginationInput[]>([]);
    const [selectedPostId, setSelectedPostId] = useState<string | undefined>();
    const [topicSearchValue, setTopicSearchValue] = useState("");
    const debouncedSearch = useDebounce(topicSearchValue, 300);
    const { getPosts, getComments, getTopics } = usePagination();
    const toast = useToast();

    const getCommunity = async (communityId: string) => {
        const res = await CommunityService.get({ communityId });
        setCommunityState((prev) => ({
            ...prev,
            selectedCommunity: res ? res : null,
        }));
    };

    const getUserCommunityRole = async (
        communityId: string,
        userId: string
    ) => {
        const userCommunityRole = await CommunityService.getUserRole({
            communityId,
            userId,
        });
        setCommunityState((prev) => ({
            ...prev,
            userCommunityRole,
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
            isAccept: true,
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
                    const postVote = await VoteService.get({
                        voteRoute: firebaseRoute.getUserPostVoteRoute(user.uid),
                        voteId: post.id!,
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
            communityPosts: [
                ...(prev.communityPosts || []),
                ...(res.posts.map((post) => ({
                    ...post,
                    communityId,
                })) as CommunityPost[]),
            ],
            communityPostVotes: postVotes,
            communityPostComments: postComments,
        }));
    };

    const getCommunityTopics = async (communityId: string) => {
        setCommunityTopicPaginationInput((prev) => ({
            ...prev,
            loading: true,
        }));
        const res = await getTopics({
            ...communityTopicPaginationInput,
            communityId,
            isAccept: true,
        });
        setCommunityTopicPaginationInput((prev) => ({
            ...prev,
            totalPage: res?.totalPage || 0,
            loading: false,
            isFirst: false,
        }));
        setCommunityState((prev) => ({
            ...prev,
            communityTopics: [
                ...(res.topics.map((topic) => ({
                    ...topic,
                    communityId,
                })) as Topic[]),
            ],
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
            commentRoute: firebaseRoute.getCommunityPostCommentRoute(
                communityId,
                postId
            ),
        });
        let commentDatas: CommunityPostCommentData[] = [];
        for (const e of res.comments) {
            if (user) {
                const userVote = await VoteService.get({
                    voteRoute: firebaseRoute.getUserCommentVoteRoute(user.uid),
                    voteId: e.id!,
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

    const joinCommunity = async () => {
        if (!user) {
            toggleView("login");
            return;
        }
        try {
            if (communityState.selectedCommunity) {
                const res = await CommunityService.join({
                    user,
                    community: communityState.selectedCommunity,
                });
                if (res) {
                    setCommunityState((prev) => ({
                        ...prev,
                        userCommunityRole: res,
                    }));
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const leaveCommunity = async () => {
        if (!user) {
            toggleView("login");
            return;
        }
        try {
            if (communityState.selectedCommunity) {
                await CommunityService.leave({
                    communityId: communityState.selectedCommunity.id!,
                    userId: user.uid,
                    userRole: communityState.userCommunityRole?.role,
                });
                setCommunityState((prev) => ({
                    ...prev,
                    selectedCommunity: {
                        ...prev.selectedCommunity!,
                        numberOfMembers:
                            (prev.selectedCommunity?.numberOfMembers || 1) - 1,
                    },
                    userCommunityRole: undefined,
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const toUserRole = async () => {
        if (user && communityState.selectedCommunity) {
            await CommunityService.changeUserRole({
                communityId: communityState.selectedCommunity.id!,
                newRole: COMMUNITY_USER_ROLE,
                userId: user.uid,
            });
            setCommunityState((prev) => ({
                ...prev,
                userCommunityRole: {
                    ...prev.userCommunityRole!,
                    role: COMMUNITY_USER_ROLE,
                },
            }));
        }
    };

    const updateCommunityImage = async (imageUrl: string) => {
        try {
            const currentCommunity = communityState.selectedCommunity!;
            const res = await CommunityService.update({
                community: currentCommunity,
                communityForm: {
                    ...currentCommunity,
                    imageUrl,
                },
            });
            if (res) {
                setCommunityState((prev) => ({
                    ...prev,
                    selectedCommunity: {
                        ...prev.selectedCommunity!,
                        imageUrl: res.imageUrl,
                    },
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateCommunityName = async (name: string) => {
        try {
            const currentCommunity = communityState.selectedCommunity!;
            const res = await validateCreateCommunity(
                { ...currentCommunity, name },
                currentCommunity.name
            );
            if (!res.result) {
                throw Error("Name exists");
            }
            const updateRes = await CommunityService.update({
                community: currentCommunity,
                communityForm: {
                    ...currentCommunity,
                    name,
                },
            });
            if (updateRes) {
                setCommunityState((prev) => ({
                    ...prev,
                    selectedCommunity: {
                        ...prev.selectedCommunity!,
                        name: updateRes.name,
                    },
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateCommunityDescription = async (description: string) => {
        try {
            const currentCommunity = communityState.selectedCommunity!;
            const updateRes = await CommunityService.update({
                community: currentCommunity,
                communityForm: {
                    ...currentCommunity,
                    description,
                },
            });
            if (updateRes) {
                setCommunityState((prev) => ({
                    ...prev,
                    selectedCommunity: {
                        ...prev.selectedCommunity!,
                        description: updateRes.description,
                    },
                }));
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
                const userPostVote = communityState.communityPostVotes?.find(
                    (item) => item.postId === postId
                )?.voteValue;
                if (!userPostVote) {
                    await VoteService.create({
                        voteRoute: firebaseRoute.getUserPostVoteRoute(user.uid),
                        rootRoute: firebaseRoute.getCommunityPostRoute(
                            communityState.selectedCommunity!.id!
                        ),
                        rootId: postId,
                        voteId: postId,
                        vote,
                    });
                } else {
                    await VoteService.update({
                        voteRoute: firebaseRoute.getUserPostVoteRoute(user.uid),
                        rootRoute: firebaseRoute.getCommunityPostRoute(
                            communityState.selectedCommunity!.id!
                        ),
                        rootId: postId,
                        voteId: postId,
                        userVote: userPostVote,
                        vote,
                    });
                }
                setCommunityState((prev) => ({
                    ...prev,
                    communityPosts: prev.communityPosts?.map((item) =>
                        item.id !== postId
                            ? item
                            : {
                                  ...item,
                                  [vote.field]: item[vote.field] + 1,
                              }
                    ),
                    communityPostVotes: prev.communityPostVotes?.map((item) =>
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
                }));
                const changing = value === userPostVote?.value ? -2 : -1;
                if (userPostVote && Object.keys(userPostVote).length !== 0) {
                    setCommunityState((prev) => ({
                        ...prev,
                        communityPosts: prev.communityPosts?.map((item) =>
                            item.id !== postId
                                ? item
                                : {
                                      ...item,
                                      [userPostVote.field]:
                                          item[userPostVote.field] + changing,
                                  }
                        ),
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
            const { selectedCommunity } = communityState;
            const res = await CommentService.create({
                user,
                commentText,
                commentRoute: firebaseRoute.getCommunityPostCommentRoute(
                    selectedCommunity?.id!,
                    postId
                ),
                rootRoute: firebaseRoute.getCommunityPostRoute(
                    selectedCommunity?.id!
                ),
                rootId: postId,
            });
            setCommunityState((prev) => ({
                ...prev,
                communityPosts: prev.communityPosts?.map((post) =>
                    post.id !== postId
                        ? post
                        : {
                              ...post,
                              numberOfComments: post.numberOfComments + 1,
                          }
                ),
                communityPostComments: prev.communityPostComments?.map(
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
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const onPostCommentReply = async (
        commentText: string,
        postId: string,
        commentId: string
    ) => {
        if (!user) {
            toggleView("login");
            return;
        }
        try {
            const { selectedCommunity } = communityState;
            const commentRoute = firebaseRoute.getCommunityPostCommentRoute(
                selectedCommunity?.id!,
                postId
            );
            const res = await CommentService.create({
                user,
                commentText,
                commentRoute: firebaseRoute.getReplyCommentRoute(
                    commentRoute,
                    commentId
                ),
                rootRoute: firebaseRoute.getCommunityPostRoute(
                    selectedCommunity?.id!
                ),
                rootId: postId,
                reply: {
                    parentId: commentId,
                    parentRoute: commentRoute,
                },
            });
            return res;
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
                const userVote = communityState.communityPostComments
                    ?.find((item) => item.postId === postId)
                    ?.comments.find(
                        (commentData) => commentData.comment.id === commentId
                    )?.userVote;
                if (!userVote) {
                    await VoteService.create({
                        voteRoute: firebaseRoute.getUserCommentVoteRoute(
                            user.uid
                        ),
                        rootRoute: firebaseRoute.getCommunityPostCommentRoute(
                            communityState.selectedCommunity!.id!,
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
                        rootRoute: firebaseRoute.getCommunityPostCommentRoute(
                            communityState.selectedCommunity!.id!,
                            postId
                        ),
                        voteId: commentId,
                        rootId: commentId,
                        vote,
                        userVote,
                    });
                }
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
                    communityPostComments: prev.communityPostComments?.map(
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
                }));
            } catch (error) {
                console.log(error);
            }
        }
    };

    const onDeletePostComment = async (comment: Comment, postId: string) => {
        if (!user || user.uid !== comment.creatorId) {
            toast({
                ...toastOption,
                title: "Không thể xóa bình luận này!",
            });
            return;
        }
        try {
            const { selectedCommunity } = communityState;
            const res = await CommentService.delete({
                commentRoute: firebaseRoute.getCommunityPostCommentRoute(
                    selectedCommunity?.id!,
                    postId
                ),
                rootRoute: firebaseRoute.getCommunityPostRoute(
                    selectedCommunity?.id!
                ),
                rootId: postId,
                commentId: comment.id!,
            });
            setCommunityState((prev) => ({
                ...prev,
                communityPostComments: prev.communityPostComments?.map(
                    (postComment) =>
                        postComment.postId !== postId
                            ? postComment
                            : {
                                  ...postComment,
                                  comments: postComment.comments.filter(
                                      (item) => item.comment.id !== comment.id
                                  ),
                              }
                ),
                communityPosts: prev.communityPosts?.map((item) =>
                    item.id !== postId
                        ? item
                        : {
                              ...item,
                              numberOfComments:
                                  item.numberOfComments - (res || 0),
                          }
                ),
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const updateListComment = async (communityId: string, postId: string) => {
        const res = await getCommunityPostComments(communityId, postId);
        setCommunityState((prev) => ({
            ...prev,
            communityPostComments: prev.communityPostComments?.map((item) =>
                item.postId !== postId
                    ? item
                    : {
                          ...item,
                          comments: [...item.comments, ...res],
                      }
            ),
        }));
        setSelectedPostId(undefined);
    };

    const getCommunityInfo = async (community: Community, userId?: string) => {
        setCommunityState((prev) => ({
            ...prev,
            communityLoading: true,
        }));
        const res = await CommunityService.getRelated({ community });
        setCommunityState((prev) => ({
            ...prev,
            relatedCommunities: res,
        }));
        if (userId) {
            await getUserCommunityRole(community.id!, userId);
            await CommunityService.updateUserLatestPost(userId, community);
        }
        setCommunityState((prev) => ({
            ...prev,
            communityLoading: false,
        }));
    };

    useEffect(() => {
        setCommunityTopicPaginationInput((prev) => ({
            ...prev,
            page: 1,
            searchValue: topicSearchValue,
        }));
    }, [debouncedSearch]);

    useEffect(() => {
        const { selectedCommunity } = communityState;
        if (selectedCommunity) {
            getCommunityInfo(selectedCommunity, user?.uid);
        }
    }, [communityState.selectedCommunity?.id, user]);

    useEffect(() => {
        const { selectedCommunity } = communityState;
        if (selectedCommunity) {
            getCommunityPosts(selectedCommunity.id!);
        }
    }, [
        communityState.selectedCommunity?.id,
        communityPostPaginationInput.page,
    ]);

    useEffect(() => {
        const { selectedCommunity } = communityState;
        if (selectedCommunity) {
            getCommunityTopics(selectedCommunity.id!);
        }
    }, [
        communityState.selectedCommunity?.id,
        communityTopicPaginationInput.page,
        communityTopicPaginationInput.searchValue,
    ]);

    useEffect(() => {
        const { selectedCommunity } = communityState;
        if (selectedCommunity && selectedPostId) {
            updateListComment(selectedCommunity.id!, selectedPostId);
        }
    }, [communityState.selectedCommunity?.id, selectedPostId]);

    useEffect(() => {
        const { cid } = router.query;
        if (cid) {
            getCommunity(cid as string);
        } else {
            setCommunityState((prev) => ({
                ...prev,
                selectedCommunity: undefined,
            }));
        }
    }, [router.query]);

    return (
        <CommunityContext.Provider
            value={{
                communityAction: {
                    setSelectedCommunity: (community) =>
                        setCommunityState((prev) => ({
                            ...prev,
                            selectedCommunity: community,
                        })),
                    updateCommunityImage,
                    updateCommunityName,
                    updateCommunityDescription,
                    onPostVote,
                    onPostComment,
                    onPostCommentReply,
                    onPostCommentVote,
                    onDeletePostComment,
                    joinCommunity,
                    leaveCommunity,
                    toUserRole,
                },
                communityState: {
                    ...communityState,
                    communityPostPagination: {
                        state: communityPostPaginationInput,
                        onNext: () =>
                            setCommunityPostPaginationInput((prev) => ({
                                ...prev,
                                page: prev.page + 1,
                                isNext: true,
                            })),
                        onPrev: () =>
                            setCommunityPostPaginationInput((prev) => ({
                                ...prev,
                                page: prev.page - 1,
                                isNext: false,
                            })),
                    },
                    communityTopicPagination: {
                        state: communityTopicPaginationInput,
                        onNext: () =>
                            setCommunityTopicPaginationInput((prev) => ({
                                ...prev,
                                page: prev.page + 1,
                                isNext: true,
                            })),
                        onPrev: () =>
                            setCommunityTopicPaginationInput((prev) => ({
                                ...prev,
                                page: prev.page - 1,
                                isNext: false,
                            })),
                        searchValue: topicSearchValue,
                        setSearchValue: setTopicSearchValue,
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
