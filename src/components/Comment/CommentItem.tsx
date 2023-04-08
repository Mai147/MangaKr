import { useComment } from "@/hooks/useComment";
import useModal from "@/hooks/useModal";
import { Comment } from "@/models/Comment";
import { UserModel } from "@/models/User";
import { basicVoteList, Vote } from "@/models/Vote";
import {
    Avatar,
    Box,
    Button,
    Flex,
    HStack,
    Link,
    SkeletonCircle,
    SkeletonText,
    Spinner,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/vi";
import React, { useMemo, useState } from "react";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { BsReply } from "react-icons/bs";
import VotePopup from "../Post/Item/ReactionBar/VotePopup";
import CommentReaction from "./Reaction";
import ReplyCommentInput from "./Reply/ReplyCommentInput";

type CommentItemProps = {
    comment: Comment;
    user?: UserModel;
    canReply?: boolean;
    isReply?: {
        parentId: string;
    };
};

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    user,
    canReply = true,
    isReply,
}) => {
    const { commentAction, commentState } = useComment();
    const { toggleView } = useModal();
    const [showReplyComment, setShowReplyComment] = useState(false);
    const [showReplyCommentList, setShowReplyCommentList] = useState(false);

    const replyList = useMemo(() => {
        return (
            commentState.commentPaginationOutput.commentDatas.find(
                (item) => item.comment.id === comment.id
            )?.replyComments || []
        );
    }, [commentState.commentPaginationOutput.commentDatas]);

    return (
        <Flex py={4} borderBottom="1px solid" borderColor="gray.200">
            <Box mr={2}>
                <Avatar
                    size={"sm"}
                    src={comment.creatorImageUrl || ""}
                    referrerPolicy="no-referrer"
                />
            </Box>
            <Flex direction="column" flexGrow={1}>
                <VStack spacing={1} align="flex-start">
                    <HStack align="center" spacing={2} fontSize="8pt">
                        <Text
                            fontWeight={700}
                            _hover={{
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                        >
                            {comment.creatorDisplayName}
                        </Text>
                        {comment.createdAt?.seconds && (
                            <Text color="gray.600">
                                {moment(
                                    new Date(comment.createdAt?.seconds * 1000)
                                )
                                    .locale("vi")
                                    .fromNow()}
                            </Text>
                        )}
                    </HStack>
                    <Text fontSize="10pt" whiteSpace={"pre-line"}>
                        {comment.text}
                    </Text>
                    <Stack direction="row" align="center" spacing={2}>
                        <VotePopup
                            voteList={basicVoteList}
                            triggerIconSize={20}
                            userVoteValue={
                                commentState.commentPaginationOutput.commentDatas.find(
                                    (item) => item.comment.id === comment.id
                                )?.voteValue
                            }
                            onVote={async (vote) => {
                                await commentAction.vote(
                                    vote as Vote,
                                    comment.id!,
                                    isReply
                                );
                            }}
                        />
                        <CommentReaction
                            icon={AiOutlineLike}
                            value={comment.numberOfLikes}
                        />
                        <CommentReaction
                            icon={AiOutlineDislike}
                            value={comment.numberOfDislikes}
                        />
                        <CommentReaction
                            icon={BsReply}
                            value={comment.numberOfReplies}
                        />
                        {canReply && (
                            <>
                                <Box
                                    borderLeft="1px solid"
                                    borderColor="gray.300"
                                    h="100%"
                                ></Box>
                                <Text
                                    fontSize={12}
                                    fontWeight={500}
                                    cursor="pointer"
                                    _hover={{ color: "brand.400" }}
                                    onClick={() => {
                                        if (!user) {
                                            toggleView("login");
                                        } else {
                                            setShowReplyComment(true);
                                        }
                                    }}
                                >
                                    Phản hồi
                                </Text>
                            </>
                        )}
                        {user?.uid === comment.creatorId && (
                            <>
                                <Box
                                    borderLeft="1px solid"
                                    borderColor="gray.300"
                                    h="100%"
                                ></Box>
                                {commentState.loading.deleteComment.find(
                                    (item) => item.commentId === comment.id
                                )?.loading ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <Text
                                        fontSize={12}
                                        fontWeight={500}
                                        cursor="pointer"
                                        _hover={{ color: "brand.400" }}
                                        onClick={async () => {
                                            await commentAction.delete(
                                                comment,
                                                isReply
                                            );
                                        }}
                                    >
                                        Xóa bình luận
                                    </Text>
                                )}
                            </>
                        )}
                    </Stack>
                </VStack>
                {showReplyComment && (
                    <Box w="100%" mt={4}>
                        <ReplyCommentInput
                            user={user!}
                            parentCommentId={comment.id!}
                            onHidden={() => {
                                setShowReplyComment(false);
                            }}
                        />
                    </Box>
                )}
                {!showReplyCommentList && replyList.length > 0 && (
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
                {showReplyCommentList && (
                    <>
                        {replyList.map((commentData) => (
                            <CommentItem
                                key={commentData.comment.id}
                                comment={commentData.comment}
                                user={user}
                                canReply={false}
                                isReply={{
                                    parentId: comment.id!,
                                }}
                            />
                        ))}
                        {commentState.loading.getReply.find(
                            (item) => item.commentId === comment.id
                        )?.loading && (
                            <Box padding="6" boxShadow="lg" bg="white">
                                <SkeletonCircle size="6" />
                                <SkeletonText
                                    mt="4"
                                    noOfLines={1}
                                    spacing="4"
                                    skeletonHeight="2"
                                    fadeDuration={0.4}
                                    speed={0.8}
                                />
                            </Box>
                        )}
                        {(commentState.replyCommentPaginationOutput.find(
                            (item) => item.commentId === comment.id
                        )?.page || 1) <
                            (commentState.replyCommentPaginationOutput.find(
                                (item) => item.commentId === comment.id
                            )?.totalPage || 0) && (
                            <Button
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
                    </>
                )}
            </Flex>
        </Flex>
    );
};
export default CommentItem;
