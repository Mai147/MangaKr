import CommentInputBasic from "@/components/Comment/CommentInputBasic";
import { usePost } from "@/hooks/usePost";
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
    const { postAction, postState } = usePost();
    const [loading, setLoading] = useState(false);
    return (
        <Box px={6} w="100%">
            <CommentInputBasic
                loading={loading}
                onSubmit={async (commentText) => {
                    setLoading(true);
                    postState.selected.user
                        ? await postAction.user.comment(commentText, post.id!)
                        : await postAction.community.comment(
                              commentText,
                              post.id!
                          );
                    setLoading(false);
                    onHidden();
                }}
            />
        </Box>
    );
};
export default PostCommentInput;
