import CommentInputBasic from "@/components/Comment/CommentInputBasic";
import useCommunity from "@/hooks/useCommunity";
import { Comment } from "@/models/Comment";
import { basicVoteList, Vote } from "@/models/Vote";
import {
    Avatar,
    Box,
    Flex,
    HStack,
    Icon,
    Text,
    VStack,
} from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/vi";
import React, { useState } from "react";
import { BsReply } from "react-icons/bs";
import VotePopup from "../ReactionBar/VotePopup";

type PostCommentItemProps = {
    postId: string;
    comment: Comment;
};

const PostCommentItem: React.FC<PostCommentItemProps> = ({
    comment,
    postId,
}) => {
    const [showReplyComment, setShowReplyComment] = useState(false);
    const { communityState, communityAction } = useCommunity();
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
                    <Text>{comment.text}</Text>
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
                            await communityAction.onPostCommentVote(
                                vote as Vote,
                                comment.id!,
                                postId
                            );
                        }}
                        userVoteValue={
                            communityState.communityPostComments
                                ?.find(
                                    (postComments) =>
                                        postComments.postId === postId
                                )
                                ?.comments.find(
                                    (commentData) =>
                                        commentData.comment.id === comment.id
                                )?.userVote
                        }
                        triggerIconSize={20}
                    />
                    <Box w="1" h="1" rounded="full" bg="gray.500" />
                    <Icon
                        as={BsReply}
                        fontSize={20}
                        cursor="pointer"
                        onClick={() => setShowReplyComment((prev) => !prev)}
                    />
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
                            onSubmit={async () => {}}
                            loading={false}
                            placeholder="Phản hồi..."
                        />
                    </Box>
                )}
            </VStack>
        </Flex>
    );
};
export default PostCommentItem;
