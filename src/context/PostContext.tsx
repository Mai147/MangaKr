import { firebaseRoute } from "@/constants/firebaseRoutes";
import { toastOption } from "@/constants/toast";
import { POST_PAGE_COUNT } from "@/constants/pagination";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import { Community } from "@/models/Community";
import { Post } from "@/models/Post";
import { UserModel } from "@/models/User";
import { PostVote } from "@/models/Vote";
import VoteService from "@/services/VoteService";
import { useToast } from "@chakra-ui/react";
import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import PostService from "@/services/PostService";
import usePagination, {
    defaultPaginationInput,
    defaultPaginationOutput,
    PostPaginationInput,
} from "@/hooks/usePagination";
import PostUtils from "@/utils/PostUtils";
import { PrivacyType } from "@/constants/privacy";

export type PostItemState = {
    post: Post;
    voteValue?: PostVote;
    isShared?: boolean;
};

type PostState = {
    input: PostPaginationInput;
    output: {
        list: PostItemState[];
        page: number;
        totalPage: number;
    };
    loading: {
        getAll: boolean;
        delete: {
            postId: string;
            loading: boolean;
        }[];
    };
    selectedUser?: UserModel;
    selectedCommunity?: Community;
};

type PostAction = {
    loadMore: () => void;
    vote: (vote: PostVote, postId: string) => Promise<void>;
    delete: (post: Post) => Promise<void>;
    setNumberOfCommentsIncrement: (increment: number, postId: string) => void;
    handleSubmitPrivacy: (
        postId: string,
        userId: string,
        privacy: PrivacyType
    ) => Promise<void>;
    share: (post: Post, user: UserModel) => Promise<void>;
};

type PostContextState = {
    postState: PostState;
    postAction: PostAction;
};

const defaultPostPaginationInput: PostPaginationInput = {
    ...defaultPaginationInput,
    pageCount: POST_PAGE_COUNT,
    isAccept: true,
};

const defaultPostState: PostState = {
    loading: {
        getAll: true,
        delete: [],
    },
    input: defaultPostPaginationInput,
    output: defaultPaginationOutput,
};

const defaultPostAction: PostAction = {
    vote: async () => {},
    delete: async () => {},
    loadMore: () => {},
    setNumberOfCommentsIncrement: () => {},
    handleSubmitPrivacy: async () => {},
    share: async () => {},
};

const defaultPostContextState: PostContextState = {
    postState: defaultPostState,
    postAction: defaultPostAction,
};

export const PostContext = createContext<PostContextState>(
    defaultPostContextState
);

export const PostProvider = ({
    children,
    selectedCommunity,
    selectedUser,
}: {
    children: ReactNode;
    selectedUser?: UserModel;
    selectedCommunity?: Community;
}) => {
    const { user } = useAuth();
    const [postState, setPostState] = useState<PostState>(defaultPostState);
    const { getPosts } = usePagination();
    const { toggleView } = useModal();
    const toast = useToast();
    const isFirstRun = useRef(true);

    const getPostData = async (post: Post) => {
        let postVote;
        let isShared;
        if (user) {
            postVote = await VoteService.get({
                voteRoute: firebaseRoute.getUserPostVoteRoute(user.uid),
                voteId: post.id!,
            });
            isShared = await PostService.isShared({
                postId: post.id!,
                userId: user.uid,
            });
        }
        const postItem: PostItemState = {
            post,
            voteValue: postVote,
            isShared,
        };
        return postItem;
    };

    const getListPosts = async () => {
        setPostState((prev) => ({
            ...prev,
            loading: {
                ...prev.loading,
                getAll: true,
            },
        }));
        const input: PostPaginationInput = {
            ...postState.input,
            setDocValue: (docValue) => {
                setPostState((prev) => ({
                    ...prev,
                    input: {
                        ...prev.input,
                        docValue,
                    },
                }));
            },
            communityId: selectedCommunity?.id,
            userId: selectedUser?.uid,
            isAccept: selectedCommunity ? true : undefined,
            isLock: selectedCommunity ? false : undefined,
            privacyTypes: selectedUser?.uid
                ? await PostUtils.checkPrivacyType({
                      postCreatorId: selectedUser.uid,
                      userId: user?.uid,
                  })
                : undefined,
        };
        const res = await getPosts(input);
        if (res) {
            let postItems: PostItemState[] = [];
            for (const post of res.list) {
                const postItem = await getPostData(post);
                postItems.push(postItem);
            }
            setPostState((prev) => ({
                ...prev,
                output: {
                    list: postItems,
                    page: res.page,
                    totalPage: res.totalPage,
                },
                input: {
                    ...prev.input,
                    isFirst: false,
                },
                loading: {
                    ...prev.loading,
                    getAll: false,
                },
            }));
        }
    };

    const handleVotePost = async (vote: PostVote, postId: string) => {
        if (!user) {
            toggleView("login");
        } else {
            try {
                if (selectedUser || selectedCommunity) {
                    const { value } = vote;
                    const userPostVote = postState.output.list.find(
                        (item) => item.post.id === postId
                    )?.voteValue;
                    const voteRoute = firebaseRoute.getUserPostVoteRoute(
                        user.uid
                    );
                    const rootRoute = selectedUser
                        ? firebaseRoute.getUserPostRoute(selectedUser.uid)
                        : firebaseRoute.getCommunityPostRoute(
                              selectedCommunity!.id!
                          );
                    if (!userPostVote) {
                        await VoteService.create({
                            voteRoute,
                            rootRoute,
                            rootId: postId,
                            voteId: postId,
                            vote,
                        });
                    } else {
                        await VoteService.update({
                            voteRoute,
                            rootRoute,
                            rootId: postId,
                            voteId: postId,
                            userVote: userPostVote,
                            vote,
                        });
                    }
                    const changing = value === userPostVote?.value ? -2 : -1;
                    setPostState((prev) => ({
                        ...prev,
                        output: {
                            ...prev.output,
                            list: prev.output.list.map((item) =>
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
                    if (
                        userPostVote &&
                        Object.keys(userPostVote).length !== 0
                    ) {
                        setPostState((prev) => ({
                            ...prev,
                            output: {
                                ...prev.output,
                                list: prev.output.list.map((item) =>
                                    item.post.id !== postId
                                        ? item
                                        : {
                                              ...item,
                                              post: {
                                                  ...item.post,
                                                  [userPostVote.field]:
                                                      item.post[
                                                          userPostVote.field
                                                      ] + changing,
                                              },
                                              voteValue:
                                                  value === userPostVote?.value
                                                      ? undefined
                                                      : vote,
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

    const handleDeletePost = async (post: Post) => {
        if (!user || user.uid !== post.creatorId) {
            toast({
                ...toastOption,
                title: "Không thể xóa bài viết này!",
            });
            return;
        }
        try {
            setPostState((prev) => ({
                ...prev,
                loading: {
                    ...prev.loading,
                    delete: prev.loading.delete.map((item) =>
                        item.postId !== post.id
                            ? item
                            : {
                                  ...item,
                                  loading: true,
                              }
                    ),
                },
            }));
            await PostService.delete({
                post,
                community: selectedCommunity,
            });
            setPostState((prev) => ({
                ...prev,
                input: {
                    ...prev.input,
                    exceptionCount: (prev.input.exceptionCount || 0) - 1,
                },
                output: {
                    ...prev.output,
                    list: prev.output.list.filter(
                        (item) => item.post.id !== post.id
                    ),
                },
                loading: {
                    ...prev.loading,
                    delete: prev.loading.delete.map((item) =>
                        item.postId !== post.id
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

    const handleSubmitPrivacy = async (
        postId: string,
        userId: string,
        privacy: PrivacyType
    ) => {
        try {
            const res = await PostService.changePrivacy({
                postId,
                userId,
                privacy,
            });
            if (res) {
                setPostState((prev) => ({
                    ...prev,
                    output: {
                        ...prev.output,
                        list: prev.output.list.map((item) =>
                            item.post.id !== postId
                                ? item
                                : {
                                      ...item,
                                      post: {
                                          ...item.post,
                                          privacyType: res,
                                      },
                                  }
                        ),
                    },
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleShare = async (post: Post, user: UserModel) => {
        try {
            await PostService.share({
                post,
                user,
            });
            setPostState((prev) => ({
                ...prev,
                output: {
                    ...prev.output,
                    list: prev.output.list.map((item) =>
                        item.post.id !== post.id
                            ? item
                            : {
                                  ...item,
                                  isShared: true,
                              }
                    ),
                },
            }));
            toast({
                ...toastOption,
                title: "Chia sẻ thành công",
                status: "success",
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setPostState((prev) => ({
            ...prev,
            selectedUser,
        }));
    }, [selectedUser]);

    useEffect(() => {
        setPostState((prev) => ({
            ...prev,
            selectedCommunity,
        }));
    }, [selectedCommunity]);

    useEffect(() => {
        if (!isFirstRun.current || user) {
            if (selectedUser || selectedCommunity) {
                getListPosts();
            }
        } else {
            isFirstRun.current = false;
        }
    }, [user, selectedUser, selectedCommunity, postState.input.page]);

    useEffect(() => {
        if (selectedUser || selectedCommunity) {
            const { list } = postState.output;
            setPostState((prev) => ({
                ...prev,
                loading: {
                    ...prev.loading,
                    delete: list.map((item) => ({
                        postId: item.post.id!,
                        loading: false,
                    })),
                },
            }));
        }
    }, [postState.output.list, selectedUser, selectedCommunity]);

    return (
        <PostContext.Provider
            value={{
                postState,
                postAction: {
                    loadMore: () => {
                        setPostState((prev) => ({
                            ...prev,
                            input: {
                                ...prev.input,
                                page: prev.input.page + 1,
                                isNext: true,
                            },
                        }));
                    },
                    vote: handleVotePost,
                    delete: handleDeletePost,
                    setNumberOfCommentsIncrement: (increment, postId) => {
                        setPostState((prev) => ({
                            ...prev,
                            output: {
                                ...prev.output,
                                list: prev.output.list.map((item) =>
                                    item.post.id !== postId
                                        ? item
                                        : {
                                              ...item,
                                              post: {
                                                  ...item.post,
                                                  numberOfComments:
                                                      item.post
                                                          .numberOfComments +
                                                      increment,
                                              },
                                          }
                                ),
                            },
                        }));
                    },
                    handleSubmitPrivacy,
                    share: handleShare,
                },
            }}
        >
            {children}
        </PostContext.Provider>
    );
};
