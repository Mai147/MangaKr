import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { Comment } from "@/models/Comment";
import { UserModel } from "@/models/User";
import {
    writeBatch,
    increment,
    serverTimestamp,
    Timestamp,
    doc,
    collection,
    getDocs,
} from "firebase/firestore";

class CommentService {
    static create = async ({
        commentRoute,
        rootId,
        rootRoute,
        commentText,
        user,
        reply,
    }: {
        user: UserModel;
        commentRoute: string;
        rootRoute: string;
        rootId: string;
        commentText: string;
        reply?: {
            parentRoute: string;
            parentId: string;
        };
    }) => {
        try {
            const batch = writeBatch(fireStore);
            const commentDocRef = doc(collection(fireStore, commentRoute));
            const rootDocRef = doc(fireStore, rootRoute, rootId);
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
            if (reply) {
                const parentCommentDocRef = doc(
                    fireStore,
                    reply.parentRoute,
                    reply.parentId
                );
                batch.update(parentCommentDocRef, {
                    numberOfReplies: increment(1),
                });
            }
            await batch.commit();
            return {
                ...newComment,
                id: commentDocRef.id,
                createdAt: Timestamp.fromDate(new Date()),
            } as Comment;
        } catch (error) {
            console.log(error);
        }
    };
    static delete = async ({
        commentRoute,
        commentId,
        rootId,
        rootRoute,
        reply,
    }: {
        commentRoute: string;
        commentId: string;
        rootRoute: string;
        rootId: string;
        reply?: {
            parentRoute: string;
            parentId: string;
        };
    }) => {
        try {
            const batch = writeBatch(fireStore);
            let numberOfComments = 0;
            const rootDocRef = doc(fireStore, rootRoute, rootId);
            const commentDocRef = doc(fireStore, commentRoute, commentId);
            const replyCommentDocsRef = collection(
                fireStore,
                firebaseRoute.getReplyCommentRoute(commentRoute, commentId)
            );
            const replyCommentDocs = await getDocs(replyCommentDocsRef);
            replyCommentDocs.docs.forEach((doc) => {
                batch.delete(doc.ref);
                batch.update(rootDocRef, {
                    numberOfComments: increment(-1),
                });
                numberOfComments += 1;
            });

            batch.delete(commentDocRef);
            batch.update(rootDocRef, {
                numberOfComments: increment(-1),
            });
            numberOfComments += 1;
            if (reply) {
                const parentCommentDocRef = doc(
                    fireStore,
                    reply.parentRoute,
                    reply.parentId
                );
                batch.update(parentCommentDocRef, {
                    numberOfReplies: increment(-1),
                });
            }
            await batch.commit();
            return numberOfComments;
        } catch (error) {
            console.log(error);
        }
    };
}

export default CommentService;
