import { firebaseRoute } from "@/constants/firebaseRoutes";
import { Comment } from "@/models/Comment";
import { UserModel } from "@/models/User";
import CommentService from "@/services/CommentService";
import React, { useState } from "react";
import CommentInputBasic from "../CommentInputBasic";

type ReplyCommentInputProps = {
    user: UserModel;
    parentCommentId: string;
    commentRoute: string;
    rootRoute: string;
    rootId: string;
    onHidden: (newComment: Comment) => void;
};

const ReplyCommentInput: React.FC<ReplyCommentInputProps> = ({
    user,
    parentCommentId,
    commentRoute,
    rootId,
    rootRoute,
    onHidden,
}) => {
    const [loading, setLoading] = useState(false);

    const onSubmit = async (commentText: string) => {
        try {
            if (commentText) {
                setLoading(true);
                const res = await CommentService.create({
                    commentText,
                    commentRoute: firebaseRoute.getReplyCommentRoute(
                        commentRoute,
                        parentCommentId
                    ),
                    rootRoute,
                    rootId,
                    user,
                    reply: {
                        parentRoute: commentRoute,
                        parentId: parentCommentId,
                    },
                });
                setLoading(false);
                if (res) {
                    onHidden(res);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <CommentInputBasic onSubmit={onSubmit} loading={loading} user={user} />
    );
};
export default ReplyCommentInput;
