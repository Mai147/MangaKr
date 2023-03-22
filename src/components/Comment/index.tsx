import CommentItem from "@/components/Comment/CommentItem";
import CommentInputs from "@/components/Comment/CommentInput";
import { COMMENT_PAGE_COUNT } from "@/constants/pagination";
import { fireStore } from "@/firebase/clientApp";
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
    increment,
    serverTimestamp,
    Timestamp,
    writeBatch,
    CollectionReference,
    DocumentReference,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import RequiredLoginContainer from "../Book/Detail/Action/RequiredLoginContainer";
import usePagination, { PaginationInput } from "@/hooks/usePagination";

type CommentSectionProps = {
    commentDocsRef: CollectionReference<DocumentData>;
    rootDocRef: DocumentReference<DocumentData>;
    user?: UserModel | null;
};

interface CommentPaginationInput extends PaginationInput {
    commentList: Comment[];
}

const defaultCommentPaginationInfo: CommentPaginationInput = {
    page: 1,
    totalPage: 1,
    pageCount: COMMENT_PAGE_COUNT,
    isFirst: false,
    isNext: true,
    loading: false,
    commentList: [],
};

const CommentSection: React.FC<CommentSectionProps> = ({
    commentDocsRef,
    rootDocRef,
    user,
}) => {
    const [commentText, setCommentText] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentPagination, setCommentPagination] =
        useState<CommentPaginationInput>(defaultCommentPaginationInfo);
    const { getComments } = usePagination();

    const handleComment = async () => {
        setCommentLoading(true);
        try {
            if (!user) {
                return;
            }
            const batch = writeBatch(fireStore);
            const newComment: Comment = {
                creatorId: user.uid,
                creatorDisplayName: user.displayName!,
                creatorImageUrl: user.photoURL,
                text: commentText,
                numberOfDislikes: 0,
                numberOfLikes: 0,
                createdAt: serverTimestamp() as Timestamp,
                numberOfReplies: 0,
            };
            const commentDocRef = doc(commentDocsRef);
            batch.set(commentDocRef, newComment);
            batch.update(rootDocRef, {
                numberOfComments: increment(1),
            });
            await batch.commit();
            setCommentText("");
            setCommentPagination((prev) => ({
                ...prev,
                commentList: [
                    {
                        ...newComment,
                        id: commentDocRef.id,
                        createdAt: Timestamp.fromDate(new Date()),
                    },
                    ...prev.commentList,
                ],
            }));
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
        setCommentPagination((prev) => {
            const idx = prev.commentList.findIndex(
                (comment) => comment.id === commentId
            );
            prev.commentList[idx].numberOfLikes += likeIncrement;
            prev.commentList[idx].numberOfDislikes += dislikeIncrement;
            return prev;
        });
    };

    const onChangeReplyNumber = (commentId: string) => {
        setCommentPagination((prev) => {
            const idx = prev.commentList.findIndex(
                (comment) => comment.id === commentId
            );
            prev.commentList[idx].numberOfReplies += 1;
            return prev;
        });
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
            commentList: [...prev.commentList, ...(res?.comments as Comment[])],
            totalPage: res?.totalPage || 0,
            loading: false,
        }));
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
                            {commentPagination.commentList.map((comment) => {
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
