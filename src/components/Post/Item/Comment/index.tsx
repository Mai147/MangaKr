import { PostItemState } from "@/context/PostContext";
import { usePost } from "@/hooks/usePost";
import { Post } from "@/models/Post";
import { Box, Link, Text } from "@chakra-ui/react";
import React, { useMemo } from "react";
import PostCommentItem from "./PostCommentItem";
import PostCommentSkeleton from "./PostCommentSkeleton";

type PostCommentsProps = {
    post: Post;
};

const PostComments: React.FC<PostCommentsProps> = ({ post }) => {
    const { postState, postAction } = usePost();

    const postItem: PostItemState | undefined = useMemo(() => {
        return (
            postState.selected.user
                ? postState.postList.user
                : postState.postList.community
        ).find((item) => item.post.id === post.id);
    }, [postState.selected, postState.postList[postState.field!], post]);

    const commentInput = useMemo(() => {
        return (
            postState.selected.user
                ? postState.paginationInput.user
                : postState.paginationInput.community
        ).comment.find((item) => item.postId === post.id);
    }, [postState.selected, post, postState.paginationInput[postState.field!]]);

    return postItem?.commentData && postItem.commentData.length > 0 ? (
        <Box px={4} pb={4} w="100%">
            <Box px={2}>
                <Text fontWeight={600}>Bình luận</Text>
            </Box>
            {postItem.commentData.map((commentData) => (
                <PostCommentItem
                    key={commentData.comment.id}
                    comment={commentData.comment}
                    postId={post.id!}
                />
            ))}
            {commentInput!.inputState.loading
                ? [1, 2, 3].map((e) => (
                      <Box key={e} mb={4} px={2}>
                          <PostCommentSkeleton
                              width={`${Math.floor(
                                  Math.random() * 300 + 150
                              )}px`}
                          />
                      </Box>
                  ))
                : commentInput!.inputState.page <
                      commentInput!.inputState.totalPage && (
                      <Link
                          px={2}
                          onClick={() =>
                              postAction[postState.field!].loadMoreComment(
                                  post.id!
                              )
                          }
                          fontWeight={500}
                          color="gray.600"
                      >
                          Xem thêm bình luận...
                      </Link>
                  )}
        </Box>
    ) : (
        <></>
    );
};
export default PostComments;
