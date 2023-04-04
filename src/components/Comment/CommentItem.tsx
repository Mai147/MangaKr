import { firebaseRoute } from "@/constants/firebaseRoutes";
import useModal from "@/hooks/useModal";
import usePagination, {
    defaultPaginationInput,
    PaginationInput,
} from "@/hooks/usePagination";
import { Comment } from "@/models/Comment";
import { UserModel } from "@/models/User";
import { basicVoteList, Vote } from "@/models/Vote";
import VoteService from "@/services/VoteService";
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
import React, { useEffect, useState } from "react";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { BsReply } from "react-icons/bs";
import VotePopup from "../Post/Item/ReactionBar/VotePopup";
import CommentReaction from "./Reaction";
import ReplyCommentInput from "./Reply/ReplyCommentInput";

type CommentItemProps = {
    comment: Comment;
    commentRoute: string;
    rootRoute: string;
    rootId: string;
    onChangeCommentLike: (
        commentId: string,
        likeIncrement: number,
        dislikeIncrement: number
    ) => void;
    onChangeReplyNumber?: (commentId: string) => void;
    handleDeleteComment: (
        commentId: string,
        reply?: {
            parentRoute: string;
            parentId: string;
        }
    ) => Promise<void>;
    user?: UserModel;
    canReply?: boolean;
    isReply?: {
        parentRoute: string;
        parentId: string;
    };
};

const defaultCommentPaginationInput: PaginationInput = {
    ...defaultPaginationInput,
    pageCount: 3,
};

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    commentRoute,
    rootId,
    rootRoute,
    onChangeCommentLike,
    onChangeReplyNumber,
    handleDeleteComment,
    user,
    canReply = true,
    isReply,
}) => {
    const { toggleView } = useModal();
    const [userVote, setUserVote] = useState<Vote | undefined>(undefined);
    const [showReplyComment, setShowReplyComment] = useState(false);
    const [replyCommentPagination, setReplyCommentPagination] =
        useState<PaginationInput>(defaultCommentPaginationInput);
    const [showReplyCommentList, setShowReplyCommentList] = useState(false);
    const [replyCommentList, setReplyCommentList] = useState<Comment[]>([]);
    const [deleteCommentLoading, setDeleteCommentLoading] = useState(false);
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

    const getUserVote = async (userId: string) => {
        const res = await VoteService.get({
            voteRoute: firebaseRoute.getUserCommentVoteRoute(userId),
            voteId: comment.id!,
        });
        setUserVote(res as Vote);
    };

    const onVoteComment = async (vote: Vote) => {
        if (!user) {
            toggleView("login");
        } else {
            try {
                const { value } = vote;
                if (!userVote) {
                    await VoteService.create({
                        voteRoute: firebaseRoute.getUserCommentVoteRoute(
                            user.uid
                        ),
                        voteId: comment.id!,
                        rootRoute: commentRoute,
                        rootId: comment.id!,
                        vote,
                    });
                } else {
                    await VoteService.update({
                        voteRoute: firebaseRoute.getUserCommentVoteRoute(
                            user.uid
                        ),
                        voteId: comment.id!,
                        rootRoute: commentRoute,
                        rootId: comment.id!,
                        userVote,
                        vote,
                    });
                }
                let likeIncrement = 0;
                let dislikeIncrement = 0;
                if (userVote) {
                    if (userVote.value === "like") {
                        if (value === "like") {
                            likeIncrement = -1;
                        } else {
                            likeIncrement = -1;
                            dislikeIncrement = 1;
                        }
                    } else {
                        if (value === "dislike") {
                            dislikeIncrement = -1;
                        } else {
                            dislikeIncrement = -1;
                            likeIncrement = 1;
                        }
                    }
                } else {
                    if (value === "like") likeIncrement = 1;
                    else dislikeIncrement = 1;
                }
                setUserVote((prev) =>
                    prev?.value === value
                        ? undefined
                        : basicVoteList.find((item) => item.value === value)
                );
                onChangeCommentLike(
                    comment.id!,
                    likeIncrement,
                    dislikeIncrement
                );
            } catch (error) {
                console.log(error);
            }
        }
    };

    const onChangeReplyCommentLike = (
        commentId: string,
        likeIncrement: number,
        dislikeIncrement: number
    ) => {
        setReplyCommentList((prev) => {
            const idx = prev.findIndex((comment) => comment.id === commentId);
            prev[idx].numberOfLikes += likeIncrement;
            prev[idx].numberOfDislikes += dislikeIncrement;
            return prev;
        });
    };

    useEffect(() => {
        if (user) {
            getUserVote(user.uid);
        }
    }, [user]);

    useEffect(() => {
        if (comment.numberOfReplies > 0) {
            getReplyCommentList(commentRoute, comment.id!);
        }
    }, [replyCommentPagination.page, commentRoute, comment.id]);

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
                            userVoteValue={userVote}
                            onVote={async (vote) => {
                                await onVoteComment(vote as Vote);
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
                                {deleteCommentLoading ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <Text
                                        fontSize={12}
                                        fontWeight={500}
                                        cursor="pointer"
                                        _hover={{ color: "brand.400" }}
                                        onClick={async () => {
                                            if (!user) {
                                                toggleView("login");
                                            } else {
                                                setDeleteCommentLoading(true);
                                                await handleDeleteComment(
                                                    comment.id!,
                                                    isReply
                                                );
                                                setDeleteCommentLoading(false);
                                            }
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
                            commentRoute={commentRoute}
                            rootRoute={rootRoute}
                            rootId={rootId}
                            onHidden={(newComment) => {
                                setShowReplyComment(false);
                                setReplyCommentList((prev) => [
                                    newComment,
                                    ...prev,
                                ]);
                                onChangeReplyNumber &&
                                    onChangeReplyNumber(comment.id!);
                            }}
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
                    <>
                        {replyCommentList.map((c) => (
                            <CommentItem
                                key={c.id}
                                comment={c}
                                commentRoute={firebaseRoute.getReplyCommentRoute(
                                    commentRoute,
                                    comment.id!
                                )}
                                rootRoute={rootRoute}
                                rootId={rootId}
                                onChangeCommentLike={onChangeReplyCommentLike}
                                user={user}
                                canReply={false}
                                handleDeleteComment={async () => {
                                    await handleDeleteComment(c.id!, {
                                        parentRoute: commentRoute,
                                        parentId: comment.id!,
                                    });
                                    setReplyCommentList((prev) =>
                                        prev.filter((item) => item.id !== c.id)
                                    );
                                }}
                                isReply={{
                                    parentRoute: commentRoute,
                                    parentId: comment.id!,
                                }}
                            />
                        ))}
                        {replyCommentPagination.loading && (
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
                        {replyCommentPagination.page <
                            replyCommentPagination.totalPage && (
                            <Button
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
                    </>
                )}
            </Flex>
        </Flex>
    );
};
export default CommentItem;
