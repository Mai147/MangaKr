import CommentInputBasic from "@/components/Comment/CommentInputBasic";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import useAuth from "@/hooks/useAuth";
import useCommunity from "@/hooks/useCommunity";
import usePagination, {
    defaultPaginationInput,
    PaginationInput,
} from "@/hooks/usePagination";
import { Comment } from "@/models/Comment";
import { basicVoteList, Vote } from "@/models/Vote";
import CommentService from "@/services/CommentService";
import VoteService from "@/services/VoteService";
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
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsReply } from "react-icons/bs";
import VotePopup from "../ReactionBar/VotePopup";
import PostCommentSkeleton from "./PostCommentSkeleton";

type PostCommentItemProps = {
    postId: string;
    comment: Comment;
    isReply?: {
        parentId: string;
        setReplyCommentList: React.Dispatch<React.SetStateAction<Comment[]>>;
    };
    canReply?: boolean;
};

const defaultCommentPaginationInput: PaginationInput = {
    ...defaultPaginationInput,
    pageCount: 3,
};

const PostCommentItem: React.FC<PostCommentItemProps> = ({
    comment,
    postId,
    isReply,
    canReply = true,
}) => {
    const [showReplyComment, setShowReplyComment] = useState(false);
    const [replyCommentPagination, setReplyCommentPagination] =
        useState<PaginationInput>(defaultCommentPaginationInput);
    const [showReplyCommentList, setShowReplyCommentList] = useState(false);
    const [replyCommentList, setReplyCommentList] = useState<Comment[]>([]);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [userVote, setUserVote] = useState<Vote | undefined>();
    const [commentLike, setCommentLike] = useState<{
        numberOfLikes: number;
        numberOfDislikes: number;
    }>({
        numberOfLikes: 0,
        numberOfDislikes: 0,
    });
    const [selectedCommentId, setSelectedCommentId] = useState<
        string | undefined
    >();
    const { user } = useAuth();
    const { communityState, communityAction } = useCommunity();
    const { getComments } = usePagination();

    const getReplyCommentList = async (
        commentRoute: string,
        commentId: string
    ) => {
        setReplyCommentPagination((prev) => ({
            ...prev,
            loading: true,
        }));
        const res = await getComments({
            page: replyCommentPagination.page,
            pageCount: replyCommentPagination.pageCount,
            isFirst: false,
            isNext: replyCommentPagination.isNext,
            commentRoute: firebaseRoute.getReplyCommentRoute(
                commentRoute,
                commentId
            ),
        });
        setReplyCommentPagination((prev) => ({
            ...prev,
            totalPage: res?.totalPage || 0,
            loading: false,
        }));
        setReplyCommentList((prev) => [
            ...prev,
            ...(res.comments as Comment[]),
        ]);
    };

    const onCommentReply = async (commentText: string) => {
        const res = await communityAction.onPostCommentReply(
            commentText,
            postId,
            comment.id!
        );
        if (res) {
            setReplyCommentList((prev) => [res, ...prev]);
            setShowReplyComment(false);
        }
    };

    const getUserVote = async (userId: string) => {
        if (isReply) {
            const vote = await VoteService.get({
                voteRoute: firebaseRoute.getUserCommentVoteRoute(userId),
                voteId: comment.id!,
            });
            setUserVote(vote as Vote);
        } else {
            const vote = communityState.communityPostComments
                ?.find((postComments) => postComments.postId === postId)
                ?.comments.find(
                    (commentData) => commentData.comment.id === comment.id
                )?.userVote;
            setUserVote(vote);
        }
    };

    const onCommentVote = async (vote: Vote, userId: string) => {
        if (isReply) {
            const parentCommentRoute =
                firebaseRoute.getCommunityPostCommentRoute(
                    communityState.selectedCommunity?.id!,
                    postId
                );
            if (!userVote) {
                await VoteService.create({
                    vote,
                    voteRoute: firebaseRoute.getUserCommentVoteRoute(userId),
                    voteId: comment.id!,
                    rootRoute: firebaseRoute.getReplyCommentRoute(
                        parentCommentRoute,
                        isReply.parentId
                    ),
                    rootId: comment.id!,
                });
            } else {
                await VoteService.update({
                    vote,
                    voteRoute: firebaseRoute.getUserCommentVoteRoute(userId),
                    voteId: comment.id!,
                    rootRoute: firebaseRoute.getReplyCommentRoute(
                        parentCommentRoute,
                        isReply.parentId
                    ),
                    rootId: comment.id!,
                    userVote,
                });
                setCommentLike((prev) => ({
                    ...prev,
                    [userVote.field]: prev[userVote.field] - 2,
                }));
            }
            setCommentLike((prev) => ({
                ...prev,
                [vote.field]: prev[vote.field] + 1,
            }));
            setUserVote(vote);
        } else {
            await communityAction.onPostCommentVote(
                vote as Vote,
                comment.id!,
                postId
            );
            setSelectedCommentId(comment.id);
        }
    };

    const onCommentDelete = async () => {
        try {
            setDeleteLoading(true);
            if (isReply) {
                const parentRoute = firebaseRoute.getCommunityPostCommentRoute(
                    communityState.selectedCommunity?.id!,
                    postId
                );
                const res = await CommentService.delete({
                    commentRoute: firebaseRoute.getReplyCommentRoute(
                        parentRoute,
                        isReply.parentId
                    ),
                    commentId: comment.id!,
                    rootRoute: firebaseRoute.getCommunityPostRoute(
                        communityState.selectedCommunity?.id!
                    ),
                    rootId: postId,
                    reply: {
                        parentRoute,
                        parentId: isReply.parentId,
                    },
                });
                isReply.setReplyCommentList((prev) =>
                    prev.filter((item) => item.id !== comment.id!)
                );
            } else {
                await communityAction.onDeletePostComment(comment, postId);
            }
            setDeleteLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user) {
            getUserVote(user.uid);
        }
    }, [selectedCommentId, isReply, user]);

    useEffect(() => {
        setCommentLike({
            numberOfLikes: comment.numberOfLikes,
            numberOfDislikes: comment.numberOfDislikes,
        });
    }, [comment]);

    useEffect(() => {
        if (comment.numberOfReplies > 0) {
            const commentRoute = firebaseRoute.getCommunityPostCommentRoute(
                communityState.selectedCommunity?.id!,
                postId
            );
            getReplyCommentList(commentRoute, comment.id!);
        }
    }, [
        replyCommentPagination.page,
        communityState.selectedCommunity,
        postId,
        comment.id,
    ]);

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
                            if (!user) {
                                return;
                            }
                            await onCommentVote(vote as Vote, user.uid);
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
                                    onClick={onCommentDelete}
                                />
                            )}
                        </>
                    )}
                    {commentLike.numberOfLikes > 0 ||
                        (commentLike.numberOfDislikes > 0 && (
                            <Box w="1" h="1" rounded="full" bg="gray.500" />
                        ))}
                    {commentLike.numberOfLikes > 0 && (
                        <HStack align="center" spacing={1}>
                            <Text>{commentLike.numberOfLikes}</Text>
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
                    {commentLike.numberOfDislikes > 0 && (
                        <HStack align="center" spacing={1}>
                            <Text>{commentLike.numberOfDislikes}</Text>
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
                            onSubmit={onCommentReply}
                            loading={false}
                            placeholder="Phản hồi..."
                        />
                    </Box>
                )}
                {!showReplyCommentList && replyCommentList.length > 0 && (
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
                    <Flex direction={"column"} w="100%">
                        {replyCommentList.map((c) => (
                            <PostCommentItem
                                key={c.id}
                                comment={c}
                                postId={postId}
                                isReply={{
                                    parentId: comment.id!,
                                    setReplyCommentList,
                                }}
                                canReply={false}
                            />
                        ))}
                        {replyCommentPagination.loading && (
                            <PostCommentSkeleton />
                        )}
                        {replyCommentPagination.page <
                            replyCommentPagination.totalPage && (
                            <Button
                                alignSelf="center"
                                variant={"link"}
                                color="brand.100"
                                onClick={() =>
                                    setReplyCommentPagination((prev) => ({
                                        ...prev,
                                        page: prev.page + 1,
                                    }))
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
