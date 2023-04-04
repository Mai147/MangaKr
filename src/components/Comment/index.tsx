import CommentItem from "@/components/Comment/CommentItem";
import CommentInputs from "@/components/Comment/CommentInput";
import { COMMENT_PAGE_COUNT } from "@/constants/pagination";
import { Comment } from "@/models/Comment";
import { UserModel } from "@/models/User";
import {
    Box,
    Button,
    Flex,
    SkeletonCircle,
    SkeletonText,
    VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import RequiredLoginContainer from "../Book/Detail/Action/RequiredLoginContainer";
import usePagination, {
    defaultPaginationInput,
    PaginationInput,
} from "@/hooks/usePagination";
import useModal from "@/hooks/useModal";
import CommentService from "@/services/CommentService";

type CommentSectionProps = {
    commentRoute: string;
    rootRoute: string;
    rootId: string;
    user?: UserModel | null;
};

const defaultCommentPaginationInput: PaginationInput = {
    ...defaultPaginationInput,
    pageCount: COMMENT_PAGE_COUNT,
};

const CommentSection: React.FC<CommentSectionProps> = ({
    commentRoute,
    rootId,
    rootRoute,
    user,
}) => {
    const [commentText, setCommentText] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentPagination, setCommentPagination] = useState<PaginationInput>(
        defaultCommentPaginationInput
    );
    const [commentList, setCommentList] = useState<Comment[]>([]);
    const { getComments } = usePagination();
    const { toggleView } = useModal();

    const handleComment = async () => {
        setCommentLoading(true);
        try {
            if (!user) {
                toggleView("login");
                return;
            }
            const res = await CommentService.create({
                user,
                commentText,
                commentRoute,
                rootRoute,
                rootId,
            });
            setCommentText("");
            setCommentList((prev) => [res!, ...prev]);
        } catch (error) {
            console.log(error);
        }
        setCommentLoading(false);
    };

    const handleDeleteComment = async (
        commentId: string,
        reply?: {
            parentRoute: string;
            parentId: string;
        }
    ) => {
        if (!user) {
            toggleView("login");
            return;
        }
        try {
            await CommentService.delete({
                commentRoute,
                rootRoute,
                rootId,
                commentId,
                reply,
            });
            setCommentList((prev) =>
                prev.filter((item) => item.id !== commentId)
            );
        } catch (error) {
            console.log(error);
        }
    };

    const onChangeCommentLike = (
        commentId: string,
        likeIncrement: number,
        dislikeIncrement: number
    ) => {
        setCommentList((prev) =>
            prev.map((item) =>
                item.id !== commentId
                    ? item
                    : {
                          ...item,
                          numberOfLikes: item.numberOfLikes + likeIncrement,
                          numberOfReplies:
                              item.numberOfDislikes + dislikeIncrement,
                      }
            )
        );
    };

    const onChangeReplyNumber = (commentId: string) => {
        setCommentList((prev) =>
            prev.map((item) =>
                item.id !== commentId
                    ? item
                    : {
                          ...item,
                          numberOfReplies: item.numberOfReplies + 1,
                      }
            )
        );
    };

    const getCommentList = async () => {
        setCommentPagination((prev) => ({
            ...prev,
            loading: true,
        }));
        const res = await getComments({
            page: commentPagination.page,
            pageCount: commentPagination.pageCount,
            isFirst: false,
            isNext: commentPagination.isNext,
            commentRoute,
        });
        setCommentPagination((prev) => ({
            ...prev,
            totalPage: res?.totalPage || 0,
            loading: false,
        }));
        setCommentList((prev) => [...prev, ...res.comments]);
    };

    useEffect(() => {
        getCommentList();
    }, [commentPagination.page]);

    return (
        <>
            {!user ? (
                <RequiredLoginContainer action="bình luận" />
            ) : (
                <Box w="100%">
                    <CommentInputs
                        commentText={commentText}
                        setCommentText={setCommentText}
                        createLoading={commentLoading}
                        onCreateComment={handleComment}
                        user={user}
                    />
                    <VStack spacing={2} align="center">
                        <Flex alignSelf="stretch" direction="column">
                            {commentList.map((comment) => {
                                return (
                                    <CommentItem
                                        key={comment.id}
                                        comment={comment}
                                        commentRoute={commentRoute}
                                        rootRoute={rootRoute}
                                        rootId={rootId}
                                        onChangeCommentLike={
                                            onChangeCommentLike
                                        }
                                        onChangeReplyNumber={
                                            onChangeReplyNumber
                                        }
                                        handleDeleteComment={
                                            handleDeleteComment
                                        }
                                        user={user}
                                    />
                                );
                            })}
                            {commentPagination.loading && (
                                <Box padding="6" boxShadow="lg" bg="white">
                                    <SkeletonCircle size="10" />
                                    <SkeletonText
                                        mt="4"
                                        noOfLines={4}
                                        spacing="4"
                                        skeletonHeight="2"
                                        fadeDuration={0.4}
                                        speed={0.8}
                                    />
                                </Box>
                            )}
                        </Flex>
                        {commentPagination.page <
                            commentPagination.totalPage && (
                            <Button
                                variant={"link"}
                                color="brand.100"
                                onClick={() =>
                                    setCommentPagination((prev) => ({
                                        ...prev,
                                        page: prev.page + 1,
                                    }))
                                }
                            >
                                Xem thêm
                            </Button>
                        )}
                    </VStack>
                </Box>
            )}
        </>
    );
};
export default CommentSection;
