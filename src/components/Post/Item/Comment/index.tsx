import { CommunityPostCommentData } from "@/context/CommunityContext";
import useCommunity from "@/hooks/useCommunity";
import { Comment } from "@/models/Comment";
import { Post } from "@/models/Post";
import { Box, Link, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import PostCommentItem from "./PostCommentItem";
import PostCommentSkeleton from "./PostCommentSkeleton";

type PostCommentsProps = {
    post: Post;
};

const PostComments: React.FC<PostCommentsProps> = ({ post }) => {
    const { communityState } = useCommunity();
    const [commentDatas, setCommentDatas] = useState<
        CommunityPostCommentData[] | undefined
    >();
    const [commentInput, setCommentInput] = useState<any>();

    useEffect(() => {
        const comments = communityState.communityPostComments?.find(
            (postComments) => postComments.postId === post.id
        );
        const input = communityState.communityPostCommentPaginations?.find(
            (item) => item.state.postId === post.id
        );

        setCommentDatas(comments?.comments);
        setCommentInput(input);
    }, [communityState.communityPostComments]);

    return commentDatas && commentDatas.length > 0 ? (
        <Box px={4} pb={4} w="100%">
            <Box px={2}>
                <Text fontWeight={600}>Bình luận</Text>
            </Box>
            {commentDatas.map((commentData) => (
                <PostCommentItem
                    key={commentData.comment.id}
                    comment={commentData.comment}
                    postId={post.id!}
                />
            ))}
            {commentInput.state.inputState.page <
                commentInput.state.inputState.totalPage &&
                (communityState.communityPostCommentPaginations?.find(
                    (item) => item.state.postId === post.id
                )?.state.inputState.loading ? (
                    [1, 2, 3].map((e) => (
                        <Box key={e} mb={4}>
                            <PostCommentSkeleton
                                width={`${Math.floor(
                                    Math.random() * 300 + 150
                                )}px`}
                            />
                        </Box>
                    ))
                ) : (
                    <Link
                        px={2}
                        onClick={commentInput.onNext}
                        fontWeight={500}
                        color="gray.600"
                    >
                        Xem thêm{" "}
                        {post.numberOfComments - (commentDatas?.length || 0)}{" "}
                        bình luận...
                    </Link>
                ))}
        </Box>
    ) : (
        <></>
    );
};
export default PostComments;
