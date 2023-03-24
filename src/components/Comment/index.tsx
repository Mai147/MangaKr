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
import {
    DocumentData,
    doc,
    CollectionReference,
    DocumentReference,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import RequiredLoginContainer from "../Book/Detail/Action/RequiredLoginContainer";
import usePagination, {
    defaultPaginationInput,
    PaginationInput,
} from "@/hooks/usePagination";
import useModal from "@/hooks/useModal";
import CommentUtils from "@/utils/CommentUtils";

type CommentSectionProps = {
    commentDocsRef: CollectionReference<DocumentData>;
    rootDocRef: DocumentReference<DocumentData>;
    user?: UserModel | null;
};

const defaultCommentPaginationInput: PaginationInput = {
    ...defaultPaginationInput,
    pageCount: COMMENT_PAGE_COUNT,
};

const CommentSection: React.FC<CommentSectionProps> = ({
    commentDocsRef,
    rootDocRef,
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
            const res = await CommentUtils.onComment({
                user,
                commentText,
                commentDocRef: doc(commentDocsRef),
                rootDocRef,
            });
            setCommentText("");
            setCommentList((prev) => [res!, ...prev]);
        } catch (error) {
            console.log(error);
        }
        setCommentLoading(false);
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
            commentDocsRef: commentDocsRef,
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
                                        commentDocsRef={commentDocsRef}
                                        rootDocRef={rootDocRef}
                                        onChangeCommentLike={
                                            onChangeCommentLike
                                        }
                                        onChangeReplyNumber={
                                            onChangeReplyNumber
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
