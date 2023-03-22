import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { Comment } from "@/models/Comment";
import { UserModel } from "@/models/User";
import { Avatar, Flex, IconButton, Input } from "@chakra-ui/react";
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
import { AiOutlineSend } from "react-icons/ai";

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
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
                setCommentText("");
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
        <form onSubmit={onSubmit}>
            <Flex mt={4} w="100%" position="relative">
                <Input
                    autoFocus
                    flexGrow={1}
                    bg="white"
                    px={12}
                    borderRadius="100"
                    boxShadow="rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                />
                <Avatar
                    src={user.photoURL || "/images/noImage.jpg"}
                    size="sm"
                    position="absolute"
                    top={1}
                    left={1}
                    zIndex={10}
                />
                <IconButton
                    aria-label="Send button"
                    variant="ghost"
                    type="submit"
                    icon={<AiOutlineSend />}
                    position="absolute"
                    fontSize={20}
                    color="gray.500"
                    top={0}
                    right={0}
                    zIndex={10}
                    isLoading={loading}
                />
            </Flex>
        </form>
    );
};
export default ReplyCommentInput;
