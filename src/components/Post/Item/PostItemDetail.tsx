import { firebaseRoute } from "@/constants/firebaseRoutes";
import { CommentProvider } from "@/context/CommentContext";
import usePost from "@/hooks/usePost";
import { Post } from "@/models/Post";
import { Box, Flex, VStack } from "@chakra-ui/react";
import React from "react";
import PostComments from "./Comment";
import PostCommentInput from "./Comment/PostCommentInput";
import PostItemContent from "./Content";
import PostItemHeader from "./Header";
import PostItemImages from "./Images";
import PostReactionBar from "./ReactionBar";

type PostItemDetailProps = {
    post: Post;
};

const PostItemDetail: React.FC<PostItemDetailProps> = ({ post }) => {
    const { postState, postAction } = usePost();
    return (
        <Box
            border="1px solid"
            borderColor="gray.300"
            borderRadius={8}
            boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
            overflow="hidden"
            mb={10}
            w="100%"
            bg="white"
        >
            <VStack align="flex-start" w="100%" pb={4}>
                <PostItemHeader
                    post={post}
                    action={false}
                    size="lg"
                    back={true}
                />
                <Flex w="100%">
                    <Box w="60%" flexShrink={0}>
                        <PostItemContent post={post} size="lg" />
                        <Box w="100%" px={8}>
                            <PostItemImages imageList={post.imageUrls} />
                        </Box>
                        <Box w="100%" mt={2} px={8}>
                            <video src={post.videoUrl} controls width="100%" />
                        </Box>
                        <PostReactionBar post={post} size="lg" />
                    </Box>
                    <Box borderRight="1px solid" borderColor="gray.300"></Box>
                    <Box w="100%" py={4}>
                        {(postState.selectedCommunity ||
                            postState.selectedUser) && (
                            <CommentProvider
                                commentRoute={
                                    postState.selectedUser
                                        ? firebaseRoute.getUserPostCommentRoute(
                                              postState.selectedUser.uid,
                                              post.id!
                                          )
                                        : firebaseRoute.getCommunityPostCommentRoute(
                                              postState.selectedCommunity!.id!,
                                              post.id!
                                          )
                                }
                                rootRoute={
                                    postState.selectedUser
                                        ? firebaseRoute.getUserPostRoute(
                                              postState.selectedUser.uid
                                          )
                                        : firebaseRoute.getCommunityPostRoute(
                                              postState.selectedCommunity!.id!
                                          )
                                }
                                rootId={post.id!}
                                setNumberOfCommentsIncrement={(increment) =>
                                    postAction.setNumberOfCommentsIncrement(
                                        increment,
                                        post.id!
                                    )
                                }
                            >
                                <Box pb={3} w="100%">
                                    <PostCommentInput onHidden={() => {}} />
                                </Box>
                                {post.numberOfComments === 0 ? (
                                    <Flex
                                        px={4}
                                        align="center"
                                        justify="center"
                                        alignSelf="flex-start"
                                        flexGrow={1}
                                    >
                                        Chưa có bình luận nào
                                    </Flex>
                                ) : (
                                    <PostComments post={post} />
                                )}
                            </CommentProvider>
                        )}
                    </Box>
                </Flex>
            </VStack>
        </Box>
    );
};
export default PostItemDetail;
