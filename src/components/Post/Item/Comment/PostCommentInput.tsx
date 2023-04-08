import CommentInputBasic from "@/components/Comment/CommentInputBasic";
import { useComment } from "@/hooks/useComment";
import { Post } from "@/models/Post";
import { Box } from "@chakra-ui/react";
import React from "react";

type PostCommentInputProps = {
    onHidden: () => void;
};

const PostCommentInput: React.FC<PostCommentInputProps> = ({ onHidden }) => {
    const { commentAction, commentState } = useComment();
    return (
        <Box px={6} w="100%">
            <CommentInputBasic
                loading={commentState.loading.comment}
                onSubmit={async (commentText) => {
                    await commentAction.comment(commentText);
                    onHidden();
                }}
            />
        </Box>
    );
};
export default PostCommentInput;
