import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore, storage } from "@/firebase/clientApp";
import { Community } from "@/models/Community";
import { LatestPost, Post } from "@/models/Post";
import FileUtils from "@/utils/FileUtils";
import {
    writeBatch,
    doc,
    collection,
    serverTimestamp,
    Timestamp,
    increment,
    getDocs,
    query,
    collectionGroup,
    where,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

class PostService {
    static create = async ({
        postForm,
        community,
    }: {
        postForm: Post;
        community?: Community;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            let postDocRef;
            let rootDocRef;
            if (community) {
                postDocRef = doc(
                    collection(
                        fireStore,
                        firebaseRoute.getCommunityPostRoute(community.id!)
                    )
                );
                rootDocRef = doc(
                    fireStore,
                    firebaseRoute.getAllCommunityRoute(),
                    community.id!
                );
            } else {
                postDocRef = doc(
                    collection(
                        fireStore,
                        firebaseRoute.getUserPostRoute(postForm.creatorId)
                    )
                );
                rootDocRef = doc(
                    fireStore,
                    firebaseRoute.getAllUserRoute(),
                    postForm.creatorId
                );
            }
            const res = await FileUtils.uploadMultipleFile({
                imagesRoute: firebaseRoute.getPostImageRoute(postDocRef.id),
                imageUrls: postForm.imageUrls,
            });
            batch.set(postDocRef, {
                ...postForm,
                communityId: community?.id,
                createdAt: serverTimestamp() as Timestamp,
            });
            batch.update(rootDocRef, {
                numberOfPosts: increment(1),
            });
            if (res) {
                batch.update(postDocRef, {
                    imageUrls: res.downloadUrls,
                    imageRefs: res.downloadRefs,
                });
            }
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };

    static approve = async ({
        post,
        community,
        isAccept,
    }: {
        post: Post;
        community?: Community;
        isAccept: boolean;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            let postDocRef;
            if (community) {
                postDocRef = doc(
                    collection(
                        fireStore,
                        firebaseRoute.getCommunityPostRoute(community.id!)
                    ),
                    post.id
                );
                const communityDocRef = doc(
                    fireStore,
                    firebaseRoute.getAllCommunityRoute(),
                    community.id!
                );
                if (isAccept) {
                    const latestPost: LatestPost = {
                        id: postDocRef.id,
                        communityId: community.id!,
                        communityName: community.name,
                        creatorId: post.creatorId,
                        creatorDisplayName: post.creatorDisplayName,
                        imageUrl: community.imageUrl,
                        createdAt: serverTimestamp() as Timestamp,
                    };
                    batch.update(communityDocRef, {
                        numberOfPosts: increment(1),
                        latestPost,
                    });
                }
            } else {
                postDocRef = doc(
                    collection(
                        fireStore,
                        firebaseRoute.getUserPostRoute(post.creatorId)
                    ),
                    post.id
                );
            }
            if (isAccept) {
                batch.update(postDocRef, {
                    isAccept,
                });
            } else {
                batch.delete(postDocRef);
            }
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };

    static delete = async ({
        post,
        community,
    }: {
        post: Post;
        community?: Community;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            if (post.imageRefs && post.imageRefs.length > 0) {
                for (const imageRef of post.imageRefs) {
                    await deleteObject(ref(storage, imageRef));
                }
            }
            let postDocRef;
            let postCommentDocsRef;
            let rootDocRef;
            if (community) {
                postDocRef = doc(
                    fireStore,
                    firebaseRoute.getCommunityPostRoute(community.id!),
                    post.id!
                );
                postCommentDocsRef = collection(
                    fireStore,
                    firebaseRoute.getCommunityPostCommentRoute(
                        community.id!,
                        post.id!
                    )
                );
                rootDocRef = doc(
                    fireStore,
                    firebaseRoute.getAllCommunityRoute(),
                    community.id!
                );
            } else {
                postDocRef = doc(
                    fireStore,
                    firebaseRoute.getUserPostRoute(post.creatorId),
                    post.id!
                );
                postCommentDocsRef = collection(
                    fireStore,
                    firebaseRoute.getUserPostCommentRoute(
                        post.creatorId,
                        post.id!
                    )
                );
                rootDocRef = doc(
                    fireStore,
                    firebaseRoute.getAllUserRoute(),
                    post.creatorId
                );
            }
            const commentDocs = await getDocs(postCommentDocsRef);
            for (const commentDoc of commentDocs.docs) {
                const replyCommentDocsRef = collection(
                    fireStore,
                    `${commentDoc.ref.path}/comments`
                );
                const replyCommentDocs = await getDocs(replyCommentDocsRef);
                for (const replyCommentDoc of replyCommentDocs.docs) {
                    batch.delete(replyCommentDoc.ref);
                }
                batch.delete(commentDoc.ref);
            }
            const userPostVoteQuery = query(
                collectionGroup(fireStore, "postVotes"),
                where("id", "==", post.id!)
            );
            const userPostVoteDocs = await getDocs(userPostVoteQuery);
            for (const userPostVoteDoc of userPostVoteDocs.docs) {
                batch.delete(userPostVoteDoc.ref);
            }
            batch.delete(postDocRef);
            batch.update(rootDocRef, {
                numberOfPosts: increment(-1),
            });
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };
}

export default PostService;
