import { useComment } from "@/hooks/useComment";
import { UserModel } from "@/models/User";
import React from "react";
import CommentInputBasic from "../CommentInputBasic";

type ReplyCommentInputProps = {
    user: UserModel;
    parentCommentId: string;
    onHidden: () => void;
};

const ReplyCommentInput: React.FC<ReplyCommentInputProps> = ({
    user,
    parentCommentId,
    onHidden,
}) => {
    const { commentAction, commentState } = useComment();

    return (
        <CommentInputBasic
            onSubmit={async (commentText) => {
                await commentAction.reply(commentText, parentCommentId);
                onHidden();
            }}
            loading={
                commentState.loading.reply.find(
                    (item) => item.commentId === parentCommentId
                )?.loading || false
            }
            user={user}
        />
    );
};
export default ReplyCommentInput;
