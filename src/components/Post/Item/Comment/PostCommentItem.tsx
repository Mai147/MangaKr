import CommentInputBasic from "@/components/Comment/CommentInputBasic";
import useAuth from "@/hooks/useAuth";
import { usePost } from "@/hooks/usePost";
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
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { user } = useAuth();
    const { postAction, postState } = usePost();

    const commentDatas = useMemo(() => {
        return postState.postList[postState.field!].find(
            (item) => item.post.id === postId
        )?.commentData;
    }, [postState.selected, postState.postList[postState.field!]]);

    const replyCommentDatas = useMemo(() => {
        return commentDatas?.find((item) => item.comment.id === comment.id)
            ?.replyComments;
    }, [commentDatas]);

    const replyCommentPaginationInput = useMemo(() => {
        return postState.paginationInput[postState.field!].replyComment.find(
            (item) => item.commentId === comment.id
        )?.inputState;
    }, [postState.selected, postState.paginationInput[postState.field!]]);

    const userVote = useMemo(() => {
        if (commentDatas) {
            return isReply
                ? commentDatas
                      ?.find((item) => item.comment.id === isReply.parentId)
                      ?.replyComments?.find(
                          (item) => item.comment.id === comment.id
                      )?.voteValue
                : commentDatas?.find((item) => item.comment.id === comment.id)
                      ?.voteValue;
        }
    }, [commentDatas]);

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
                            await postAction[postState.field!].voteComment(
                                vote as Vote,
                                comment.id!,
                                postId,
                                isReply
                                    ? {
                                          parentId: isReply.parentId,
                                      }
                                    : undefined
                            );
                        }}
                        userVoteValue={userVote}
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
                            {deleteLoading ? (
                                <Spinner size="sm" />
                            ) : (
                                <Icon
                                    as={AiOutlineDelete}
                                    cursor="pointer"
                                    fontSize={18}
                                    onClick={async () => {
                                        setDeleteLoading(true);
                                        await postAction[
                                            postState.field!
                                        ].deleteComment(
                                            comment,
                                            postId,
                                            isReply
                                        );
                                        setDeleteLoading(false);
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
                                await postAction[postState.field!].replyComment(
                                    commentText,
                                    postId,
                                    comment.id!
                                );
                                setShowReplyComment(false);
                            }}
                            loading={false}
                            placeholder="Phản hồi..."
                        />
                    </Box>
                )}
                {!showReplyCommentList &&
                    replyCommentDatas &&
                    replyCommentDatas.length > 0 && (
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
                {showReplyCommentList && replyCommentDatas && (
                    <Flex direction={"column"} w="100%">
                        {replyCommentDatas.map((replyCommentData) => (
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
                        {replyCommentPaginationInput &&
                            replyCommentPaginationInput.loading && (
                                <PostCommentSkeleton />
                            )}
                        {replyCommentPaginationInput &&
                            replyCommentPaginationInput.page <
                                replyCommentPaginationInput.totalPage && (
                                <Button
                                    alignSelf="center"
                                    variant={"link"}
                                    color="brand.100"
                                    onClick={() =>
                                        postAction[
                                            postState.field!
                                        ].loadMoreReplyComment(
                                            comment.id!,
                                            postId
                                        )
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
