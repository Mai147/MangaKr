import CommentItem from "@/components/Comment/CommentItem";
import CommentInputs from "@/components/Comment/CommentInput";
import { UserModel } from "@/models/User";
import {
    Box,
    Button,
    Flex,
    SkeletonCircle,
    SkeletonText,
    Text,
    VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import RequiredLoginContainer from "../Book/Detail/Action/RequiredLoginContainer";
import { useComment } from "@/hooks/useComment";

type CommentSectionProps = {
    user?: UserModel | null;
};

const CommentSection: React.FC<CommentSectionProps> = ({ user }) => {
    const [commentText, setCommentText] = useState("");
    const { commentAction, commentState } = useComment();

    return (
        <>
            {!user ? (
                <RequiredLoginContainer action="bình luận" />
            ) : (
                <Box w="100%">
                    <CommentInputs
                        commentText={commentText}
                        setCommentText={setCommentText}
                        createLoading={commentState.loading.comment}
                        onCreateComment={commentAction.comment}
                        user={user}
                    />
                    <VStack spacing={2} align="center">
                        <Flex alignSelf="stretch" direction="column">
                            {commentState.commentPaginationOutput.commentDatas.map(
                                (commentData) => {
                                    return (
                                        <CommentItem
                                            key={commentData.comment.id}
                                            comment={commentData.comment}
                                            user={user}
                                        />
                                    );
                                }
                            )}
                            {commentState.loading.getComment && (
                                <Box
                                    padding="6"
                                    boxShadow="lg"
                                    bg="white"
                                    mt={2}
                                >
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
                        {!commentState.loading.getComment &&
                            commentState.commentPaginationOutput.page <
                                commentState.commentPaginationOutput
                                    .totalPage && (
                                <Button
                                    variant={"link"}
                                    color="brand.100"
                                    onClick={commentAction.loadMore}
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
