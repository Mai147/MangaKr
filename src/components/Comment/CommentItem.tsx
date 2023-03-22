import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import useModal from "@/hooks/useModal";
import usePagination, { PaginationInput } from "@/hooks/usePagination";
import { Comment } from "@/models/Comment";
import { UserModel } from "@/models/User";
import {
    Avatar,
    Box,
    Button,
    Flex,
    HStack,
    SkeletonCircle,
    SkeletonText,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react";
import {
    collection,
    CollectionReference,
    doc,
    DocumentData,
    DocumentReference,
    getDoc,
    increment,
    writeBatch,
} from "firebase/firestore";
import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { BsReply } from "react-icons/bs";
import CommentReaction from "./Reaction";
import ReactionBtn from "./Reaction/ReactionBtn";
import ReplyCommentInput from "./Reply/ReplyCommentInput";

type CommentItemProps = {
    comment: Comment;
    commentDocsRef: CollectionReference<DocumentData>;
    rootDocRef: DocumentReference<DocumentData>;
    onChangeCommentLike: (
        commentId: string,
        likeIncrement: number,
        dislikeIncrement: number
    ) => void;
    onChangeReplyNumber?: (commentId: string) => void;
    user?: UserModel;
    canReply?: boolean;
};

interface CommentPaginationInput extends PaginationInput {
    commentList: Comment[];
}

const defaultCommentPaginationInfo: CommentPaginationInput = {
    page: 1,
    totalPage: 1,
    pageCount: 1,
    isFirst: false,
    isNext: true,
    loading: false,
    commentList: [],
};

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    commentDocsRef,
    rootDocRef,
    onChangeCommentLike,
    onChangeReplyNumber,
    user,
    canReply = true,
}) => {
    const { toggleView } = useModal();
    const [userVote, setUserVote] = useState<1 | -1 | undefined>(undefined);
    const [likeLoading, setLikeLoading] = useState(false);
    const [dislikeLoading, setDislikeLoading] = useState(false);
    const [showReplyComment, setShowReplyComment] = useState(false);
    const [replyCommentPagination, setReplyCommentPagination] =
        useState<CommentPaginationInput>(defaultCommentPaginationInfo);
    const { getComments } = usePagination();
    const isFirst = useRef(true);

    const getReplyCommentList = async (
        commentDocsRef: CollectionReference<DocumentData>,
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
            commentDocsRef: collection(
                fireStore,
                firebaseRoute.getReplyCommentRoute(
                    commentDocsRef.path,
                    commentId
                )
            ),
        });
        setReplyCommentPagination((prev) => ({
            ...prev,
            commentList: [...prev.commentList, ...(res?.comments as Comment[])],
            totalPage: res?.totalPage || 0,
            loading: false,
        }));
    };

    const getUserVote = async (userId: string) => {
        const userCommentVoteDocRef = doc(
            fireStore,
            firebaseRoute.getUserCommentVoteRoute(userId),
            comment.id!
        );
        const userCommentVoteDoc = await getDoc(userCommentVoteDocRef);
        if (userCommentVoteDoc.exists()) {
            setUserVote(userCommentVoteDoc.data().value);
        } else {
            setUserVote(undefined);
        }
    };

    const handleLikeComment = async (value: 1 | -1) => {
        if (!user) {
            toggleView("login");
            return;
        }
        value === 1 ? setLikeLoading(true) : setDislikeLoading(true);
        try {
            const batch = writeBatch(fireStore);
            const userCommentVoteRef = doc(
                fireStore,
                firebaseRoute.getUserCommentVoteRoute(user.uid),
                comment.id!
            );
            const commentDocRef = doc(commentDocsRef, comment.id!);
            let likeIncrement = 0;
            let dislikeIncrement = 0;
            if (!userVote) {
                batch.set(userCommentVoteRef, {
                    value,
                });
                value === 1 ? (likeIncrement = 1) : (dislikeIncrement = 1);
            } else {
                if (value === userVote) {
                    batch.delete(userCommentVoteRef);
                    value === 1
                        ? (likeIncrement = -1)
                        : (dislikeIncrement = -1);
                } else {
                    batch.update(userCommentVoteRef, {
                        value,
                    });
                    if (value === 1) {
                        likeIncrement = 1;
                        dislikeIncrement = -1;
                    } else {
                        likeIncrement = -1;
                        dislikeIncrement = 1;
                    }
                }
            }
            batch.update(commentDocRef, {
                numberOfLikes: increment(likeIncrement),
                numberOfDislikes: increment(dislikeIncrement),
            });
            await batch.commit();
            setUserVote((prev) => (prev === value ? undefined : value));
            onChangeCommentLike(comment.id!, likeIncrement, dislikeIncrement);
        } catch (error) {
            console.log(error);
        }
        value === 1 ? setLikeLoading(false) : setDislikeLoading(false);
    };

    const onChangeReplyCommentLike = (
        commentId: string,
        likeIncrement: number,
        dislikeIncrement: number
    ) => {
        setReplyCommentPagination((prev) => {
            const idx = prev.commentList.findIndex(
                (comment) => comment.id === commentId
            );
            prev.commentList[idx].numberOfLikes += likeIncrement;
            prev.commentList[idx].numberOfDislikes += dislikeIncrement;
            return prev;
        });
    };

    useEffect(() => {
        if (user) {
            getUserVote(user.uid);
        }
    }, [user]);

    useEffect(() => {
        if (isFirst.current) {
            setReplyCommentPagination((prev) => ({
                ...prev,
                pageCount: 3,
            }));
        } else {
            isFirst.current === false;
        }
        if (comment.numberOfReplies > 0) {
            getReplyCommentList(commentDocsRef, comment.id!);
        }
    }, [replyCommentPagination.page, commentDocsRef, comment.id]);

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
                    <Text fontSize="10pt">{comment.text}</Text>
                    <Stack direction="row" align="center" spacing={2}>
                        <ReactionBtn
                            userVote={userVote}
                            likeLoading={likeLoading}
                            dislikeLoading={dislikeLoading}
                            handleLikeComment={handleLikeComment}
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
                    </Stack>
                </VStack>
                {showReplyComment && (
                    <ReplyCommentInput
                        user={user!}
                        parentCommentId={comment.id!}
                        commentDocsRef={commentDocsRef}
                        rootDocRef={rootDocRef}
                        onHidden={(newComment) => {
                            setShowReplyComment(false);
                            setReplyCommentPagination((prev) => ({
                                ...prev,
                                commentList: [newComment, ...prev.commentList],
                            }));
                            onChangeReplyNumber &&
                                onChangeReplyNumber(comment.id!);
                        }}
                    />
                )}
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
                {replyCommentPagination.commentList.map((c) => (
                    <CommentItem
                        key={c.id}
                        comment={c}
                        commentDocsRef={collection(
                            fireStore,
                            firebaseRoute.getReplyCommentRoute(
                                commentDocsRef.path,
                                comment.id!
                            )
                        )}
                        rootDocRef={rootDocRef}
                        onChangeCommentLike={onChangeReplyCommentLike}
                        user={user}
                        canReply={false}
                    />
                ))}
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
            </Flex>
        </Flex>
    );
};
export default CommentItem;
