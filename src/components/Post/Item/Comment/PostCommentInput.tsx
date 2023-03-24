import CommentInputBasic from "@/components/Comment/CommentInputBasic";
import useCommunity from "@/hooks/useCommunity";
import { Post } from "@/models/Post";
import { Box } from "@chakra-ui/react";
import React, { useState } from "react";

type PostCommentInputProps = {
    post: Post;
    onHidden: () => void;
};

const PostCommentInput: React.FC<PostCommentInputProps> = ({
    post,
    onHidden,
}) => {
    const { communityAction } = useCommunity();
    const [loading, setLoading] = useState(false);
    return (
        <Box px={6} w="100%">
            <CommentInputBasic
                loading={loading}
                onSubmit={async (commentText) => {
                    setLoading(true);
                    await communityAction.onPostComment(commentText, post.id!);
                    setLoading(false);
                    onHidden();
                }}
            />
        </Box>
    );
};
export default PostCommentInput;
