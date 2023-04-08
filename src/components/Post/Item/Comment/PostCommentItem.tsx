import CommentInputBasic from "@/components/Comment/CommentInputBasic";
import useAuth from "@/hooks/useAuth";
import { useComment } from "@/hooks/useComment";
import { Comment } from "@/models/Comment";
import { basicVoteList, Vote } from "@/models/Vote";
import {
    Avatar,
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Link,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/vi";
import React, { useMemo, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsReply } from "react-icons/bs";
import VotePopup from "../ReactionBar/VotePopup";
import PostCommentSkeleton from "./PostCommentSkeleton";

type PostCommentItemProps = {
    postId: string;
    comment: Comment;
    isReply?: {
        parentId: string;
    };
    canReply?: boolean;
};

const PostCommentItem: React.FC<PostCommentItemProps> = ({
    comment,
    postId,
    isReply,
    canReply = true,
}) => {
    const [showReplyComment, setShowReplyComment] = useState(false);
    const [showReplyCommentList, setShowReplyCommentList] = useState(false);
    const { user } = useAuth();
    const { commentAction, commentState } = useComment();

    const commentData = useMemo(() => {
        return isReply
            ? commentState.commentPaginationOutput.commentDatas
                  .find((item) => item.comment.id === isReply.parentId)
                  ?.replyComments?.find(
                      (item) => item.comment.id === comment.id
                  )
            : commentState.commentPaginationOutput.commentDatas.find(
                  (item) => item.comment.id === comment.id
              );
    }, [commentState.commentPaginationOutput.commentDatas]);

    const replyPaginationOutput = useMemo(() => {
        return commentState.replyCommentPaginationOutput.find(
            (item) => item.commentId === isReply?.parentId
        );
    }, [commentState.replyCommentPaginationOutput]);

    return (
        <Flex p={2} w="100%">
            <Avatar
                src={comment.creatorImageUrl || "/images/noImage.jpg"}
                mr={2}
                flexShrink={0}
                size="md"
            />
            <VStack align="flex-start" spacing={1} flexGrow={1}>
                <Box bg="gray.100" borderRadius={8} px={4} py={2}>
                    <Text fontWeight={500}>{comment.creatorDisplayName}</Text>
                    <Text whiteSpace="pre-line">{comment.text}</Text>
                </Box>
                <HStack align="center" color="gray.600">
                    {comment.createdAt?.seconds && (
                        <Text fontSize={14} fontWeight={500}>
                            {moment(new Date(comment.createdAt?.seconds * 1000))
                                .locale("vi")
                                .fromNow()}
                        </Text>
                    )}
                    <Box w="1" h="1" rounded="full" bg="gray.500" />
                    <VotePopup
                        voteList={basicVoteList}
                        onVote={async (vote) => {
                            await commentAction.vote(
                                vote as Vote,
                                comment.id!,
                                isReply
                            );
                        }}
                        userVoteValue={commentData?.voteValue}
                        triggerIconSize={20}
                    />
                    {canReply && (
                        <>
                            <Box w="1" h="1" rounded="full" bg="gray.500" />
                            <Icon
                                as={BsReply}
                                fontSize={20}
                                cursor="pointer"
                                onClick={() =>
                                    setShowReplyComment((prev) => !prev)
                                }
                            />
                        </>
                    )}
                    {user?.uid === comment.creatorId && (
                        <>
                            <Box w="1" h="1" rounded="full" bg="gray.500" />
                            {commentState.loading.deleteComment.find(
                                (item) => item.commentId === comment.id
                            )?.loading ? (
                                <Spinner size="sm" />
                            ) : (
                                <Icon
                                    as={AiOutlineDelete}
                                    cursor="pointer"
                                    fontSize={18}
                                    onClick={async () => {
                                        await commentAction.delete(
                                            comment,
                                            isReply
                                        );
                                    }}
                                />
                            )}
                        </>
                    )}
                    {comment.numberOfLikes > 0 ||
                        (comment.numberOfDislikes > 0 && (
                            <Box w="1" h="1" rounded="full" bg="gray.500" />
                        ))}
                    {comment.numberOfLikes > 0 && (
                        <HStack align="center" spacing={1}>
                            <Text>{comment.numberOfLikes}</Text>
                            <Icon
                                as={
                                    basicVoteList.find(
                                        (item) => item.value === "like"
                                    )?.icon
                                }
                                color={
                                    basicVoteList.find(
                                        (item) => item.value === "like"
                                    )?.color
                                }
                            />
                        </HStack>
                    )}
                    {comment.numberOfDislikes > 0 && (
                        <HStack align="center" spacing={1}>
                            <Text>{comment.numberOfDislikes}</Text>
                            <Icon
                                as={
                                    basicVoteList.find(
                                        (item) => item.value === "dislike"
                                    )?.icon
                                }
                                color={
                                    basicVoteList.find(
                                        (item) => item.value === "dislike"
                                    )?.color
                                }
                            />
                        </HStack>
                    )}
                </HStack>
                {showReplyComment && (
                    <Box w="100%">
                        <CommentInputBasic
                            onSubmit={async (commentText) => {
                                await commentAction.reply(
                                    commentText,
                                    comment.id!
                                );
                                setShowReplyComment(false);
                            }}
                            loading={
                                commentState.loading.reply.find(
                                    (item) =>
                                        item.commentId === isReply?.parentId
                                )?.loading || false
                            }
                            placeholder="Phản hồi..."
                        />
                    </Box>
                )}
                {!showReplyCommentList &&
                    commentData?.replyComments &&
                    commentData!.replyComments!.length > 0 && (
                        <Link
                            color="gray.600"
                            fontSize={14}
                            fontWeight={500}
                            mt={2}
                            onClick={() => setShowReplyCommentList(true)}
                        >
                            Xem phản hồi...
                        </Link>
                    )}
                {showReplyCommentList && commentData?.replyComments && (
                    <Flex direction={"column"} w="100%">
                        {commentData!.replyComments!.map((replyCommentData) => (
                            <PostCommentItem
                                key={replyCommentData.comment.id}
                                comment={replyCommentData.comment}
                                postId={postId}
                                isReply={{
                                    parentId: comment.id!,
                                }}
                                canReply={false}
                            />
                        ))}
                        {commentState.loading.getReply.find(
                            (item) => item.commentId === isReply?.parentId
                        )?.loading && <PostCommentSkeleton />}
                        {replyPaginationOutput &&
                            replyPaginationOutput.page <
                                replyPaginationOutput.totalPage && (
                                <Button
                                    alignSelf="center"
                                    variant={"link"}
                                    color="brand.100"
                                    onClick={() =>
                                        commentAction.loadMoreReply(comment.id!)
                                    }
                                    mt={2}
                                >
                                    Xem thêm
                                </Button>
                            )}
                    </Flex>
                )}
            </VStack>
        </Flex>
    );
};
export default PostCommentItem;
