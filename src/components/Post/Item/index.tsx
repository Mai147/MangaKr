import { Box, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import "moment/locale/vi";
import { PostItemState } from "@/context/PostContext";
import PostItemHeader from "./Header";
import PostItemContent from "./Content";
import PostItemImages from "./Images";
import PostCommentInput from "./Comment/PostCommentInput";
import PostComments from "./Comment";
import PostReactionBar from "./ReactionBar";
import { CommentProvider } from "@/context/CommentContext";
import usePost from "@/hooks/usePost";
import { firebaseRoute } from "@/constants/firebaseRoutes";

type PostItemProps = {
    postData: PostItemState;
};

const PostItem: React.FC<PostItemProps> = ({ postData }) => {
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [showCommentList, setShowCommentList] = useState(false);
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
            <VStack align="flex-start" w="100%">
                <PostItemHeader post={postData.post} />
                <PostItemContent post={postData.post} />
                <Box w="100%">
                    <PostItemImages imageList={postData.post.imageUrls} />
                </Box>
                <PostReactionBar
                    post={postData.post}
                    setShowCommentInput={setShowCommentInput}
                    setShowCommentList={setShowCommentList}
                />
                <CommentProvider
                    commentRoute={
                        postState.selectedUser
                            ? firebaseRoute.getUserPostCommentRoute(
                                  postState.selectedUser.uid,
                                  postData.post.id!
                              )
                            : firebaseRoute.getCommunityPostCommentRoute(
                                  postState.selectedCommunity!.id!,
                                  postData.post.id!
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
                    rootId={postData.post.id!}
                    setNumberOfCommentsIncrement={(increment) =>
                        postAction.setNumberOfCommentsIncrement(
                            increment,
                            postData.post.id!
                        )
                    }
                >
                    {showCommentInput && (
                        <Box pb={3} w="100%">
                            <PostCommentInput
                                onHidden={() => setShowCommentInput(false)}
                            />
                        </Box>
                    )}
                    {showCommentList && <PostComments post={postData.post} />}
                </CommentProvider>
            </VStack>
        </Box>
    );
};
export default PostItem;
