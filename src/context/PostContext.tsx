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
import { createContext, useEffect, useState } from "react";
import PostService from "@/services/PostService";
import usePagination, {
    defaultPaginationInput,
    defaultPaginationOutput,
    PostPaginationInput,
} from "@/hooks/usePagination";

export type PostItemState = {
    post: Post;
    voteValue?: PostVote;
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
    setSelectedUser: (user: UserModel) => void;
    setSelectedCommunity: (community: Community) => void;
    setNumberOfCommentsIncrement: (increment: number, postId: string) => void;
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
    setSelectedCommunity: () => {},
    setSelectedUser: () => {},
    setNumberOfCommentsIncrement: () => {},
};

const defaultPostContextState: PostContextState = {
    postState: defaultPostState,
    postAction: defaultPostAction,
};

export const PostContext = createContext<PostContextState>(
    defaultPostContextState
);

export const PostProvider = ({ children }: any) => {
    const { user } = useAuth();
    const [postState, setPostState] = useState<PostState>(defaultPostState);
    const { getPosts } = usePagination();
    const { toggleView } = useModal();
    const toast = useToast();

    const getPostData = async (post: Post) => {
        let postVote;
        if (user) {
            postVote = await VoteService.get({
                voteRoute: firebaseRoute.getUserPostVoteRoute(user.uid),
                voteId: post.id!,
            });
        }
        const postItem: PostItemState = {
            post,
            voteValue: postVote,
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
            communityId: postState.selectedCommunity?.id,
            userId: postState.selectedUser?.uid,
            isAccept: postState.selectedCommunity ? true : undefined,
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
                if (postState.selectedUser || postState.selectedCommunity) {
                    const { value } = vote;
                    const userPostVote = postState.output.list.find(
                        (item) => item.post.id === postId
                    )?.voteValue;
                    const voteRoute = firebaseRoute.getUserPostVoteRoute(
                        user.uid
                    );
                    const rootRoute = postState.selectedUser
                        ? firebaseRoute.getUserPostRoute(
                              postState.selectedUser.uid
                          )
                        : firebaseRoute.getCommunityPostRoute(
                              postState.selectedCommunity!.id!
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
                community: postState.selectedCommunity,
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

    useEffect(() => {
        if (postState.selectedUser || postState.selectedCommunity) {
            getListPosts();
        }
    }, [
        postState.selectedUser,
        postState.selectedCommunity,
        postState.input.page,
    ]);

    useEffect(() => {
        if (postState.selectedUser || postState.selectedCommunity) {
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
    }, [
        postState.output.list,
        postState.selectedUser,
        postState.selectedCommunity,
    ]);

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
                    setSelectedUser: (user) => {
                        setPostState((prev) => ({
                            ...prev,
                            selectedUser: user,
                        }));
                    },
                    setSelectedCommunity: (community) => {
                        setPostState((prev) => ({
                            ...prev,
                            selectedCommunity: community,
                        }));
                    },
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
                },
            }}
        >
            {children}
        </PostContext.Provider>
    );
};
