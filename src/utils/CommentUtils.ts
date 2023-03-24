import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { Comment } from "@/models/Comment";
import { UserModel } from "@/models/User";
import { PostVote, Vote } from "@/models/Vote";
import {
    writeBatch,
    doc,
    increment,
    CollectionReference,
    DocumentData,
    DocumentReference,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";

let CommentUtils = {};

const onComment = async ({
    user,
    commentDocRef,
    rootDocRef,
    commentText,
}: {
    user: UserModel;
    commentDocRef: DocumentReference<DocumentData>;
    rootDocRef: DocumentReference<DocumentData>;
    commentText: string;
}) => {
    try {
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
        batch.set(commentDocRef, newComment);
        batch.update(rootDocRef, {
            numberOfComments: increment(1),
        });
        await batch.commit();
        return {
            ...newComment,
            id: commentDocRef.id,
            createdAt: Timestamp.fromDate(new Date()),
        };
    } catch (error) {
        console.log(error);
    }
};

export default CommentUtils = {
    onComment,
};
