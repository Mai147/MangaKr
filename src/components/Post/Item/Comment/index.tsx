import { useComment } from "@/hooks/useComment";
import { Post } from "@/models/Post";
import { Box, Link, Text } from "@chakra-ui/react";
import React from "react";
import PostCommentItem from "./PostCommentItem";
import PostCommentSkeleton from "./PostCommentSkeleton";

type PostCommentsProps = {
    post: Post;
};

const PostComments: React.FC<PostCommentsProps> = ({ post }) => {
    const { commentAction, commentState } = useComment();
    return commentState.commentPaginationOutput.commentDatas.length > 0 ? (
        <Box px={4} pb={4} w="100%">
            <Box px={2}>
                <Text fontWeight={600}>Bình luận</Text>
            </Box>
            {commentState.commentPaginationOutput.commentDatas.map(
                (commentData) => (
                    <PostCommentItem
                        key={commentData.comment.id}
                        comment={commentData.comment}
                        postId={post.id!}
                    />
                )
            )}
            {commentState.loading.getComment
                ? [1, 2, 3].map((e) => (
                      <Box key={e} mb={4} px={2}>
                          <PostCommentSkeleton
                              width={`${Math.floor(
                                  Math.random() * 300 + 150
                              )}px`}
                          />
                      </Box>
                  ))
                : commentState.commentPaginationOutput.page <
                      commentState!.commentPaginationOutput.totalPage && (
                      <Link
                          px={2}
                          onClick={() => commentAction.loadMore()}
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
