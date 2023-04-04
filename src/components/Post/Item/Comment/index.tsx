import { firebaseRoute } from "@/constants/firebaseRoutes";
import { CommunityPostCommentData } from "@/context/CommunityContext";
import useCommunity from "@/hooks/useCommunity";
import { Comment } from "@/models/Comment";
import { Post } from "@/models/Post";
import CommentService from "@/services/CommentService";
import { Box, Link, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import PostCommentItem from "./PostCommentItem";
import PostCommentSkeleton from "./PostCommentSkeleton";

type PostCommentsProps = {
    post: Post;
};

const PostComments: React.FC<PostCommentsProps> = ({ post }) => {
    const { communityState, communityAction } = useCommunity();
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

    const handleDeleteComment = async ({
        isReply,
        comment,
        postId,
        setReplyCommentList,
    }: {
        isReply?: {
            parentId: string;
        };
        comment: Comment;
        postId: string;
        setReplyCommentList: React.Dispatch<React.SetStateAction<Comment[]>>;
    }) => {
        try {
            if (isReply) {
                // const parentRoute = firebaseRoute.getCommunityPostCommentRoute(
                //     communityState.selectedCommunity?.id!,
                //     postId
                // );
                // const res = await CommentService.delete({
                //     commentRoute: firebaseRoute.getReplyCommentRoute(
                //         parentRoute,
                //         isReply.parentId
                //     ),
                //     commentId: comment.id!,
                //     rootRoute: firebaseRoute.getCommunityPostRoute(
                //         communityState.selectedCommunity?.id!
                //     ),
                //     rootId: postId,
                //     reply: {
                //         parentRoute,
                //         parentId: isReply.parentId,
                //     },
                // });
                // setReplyCommentList((prev) =>
                //     prev.filter((item) => item.id !== comment.id!)
                // );
            } else {
                await communityAction.onDeletePostComment(comment, postId);
            }
        } catch (error) {
            console.log(error);
        }
    };

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
                        <Box key={e} mb={4} px={2}>
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
                        Xem thêm bình luận...
                    </Link>
                ))}
        </Box>
    ) : (
        <></>
    );
};
export default PostComments;
