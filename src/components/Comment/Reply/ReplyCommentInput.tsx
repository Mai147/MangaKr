import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { Comment } from "@/models/Comment";
import { UserModel } from "@/models/User";
import {
    collection,
    CollectionReference,
    doc,
    DocumentData,
    DocumentReference,
    increment,
    serverTimestamp,
    Timestamp,
    writeBatch,
} from "firebase/firestore";
import React, { useState } from "react";
import CommentInputBasic from "../CommentInputBasic";

type ReplyCommentInputProps = {
    user: UserModel;
    parentCommentId: string;
    commentDocsRef: CollectionReference<DocumentData>;
    rootDocRef: DocumentReference<DocumentData>;
    onHidden: (newComment: Comment) => void;
};

const ReplyCommentInput: React.FC<ReplyCommentInputProps> = ({
    user,
    parentCommentId,
    commentDocsRef,
    rootDocRef,
    onHidden,
}) => {
    const [loading, setLoading] = useState(false);

    const onSubmit = async (commentText: string) => {
        try {
            if (commentText) {
                setLoading(true);
                const batch = writeBatch(fireStore);
                const replyCommentDocsRef = doc(
                    collection(
                        fireStore,
                        firebaseRoute.getReplyCommentRoute(
                            commentDocsRef.path,
                            parentCommentId
                        )
                    )
                );
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
                batch.set(replyCommentDocsRef, newComment);
                const parentCommentDocRef = doc(
                    commentDocsRef,
                    parentCommentId
                );
                batch.update(parentCommentDocRef, {
                    numberOfReplies: increment(1),
                });
                batch.update(rootDocRef, {
                    numberOfComments: increment(1),
                });
                await batch.commit();
                setLoading(false);
                onHidden({
                    ...newComment,
                    id: replyCommentDocsRef.id,
                    createdAt: Timestamp.fromDate(new Date()),
                });
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
