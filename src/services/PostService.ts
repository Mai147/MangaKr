import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
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
} from "firebase/firestore";

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
            if (community) {
                postDocRef = doc(
                    collection(
                        fireStore,
                        firebaseRoute.getCommunityPostRoute(community.id!)
                    )
                );
            } else {
                postDocRef = doc(
                    collection(fireStore, firebaseRoute.getAllPostRoute())
                );
            }
            const postImageUrls = await FileUtils.uploadMulitpleFile({
                imagesRoute: firebaseRoute.getPostImageRoute(postDocRef.id),
                imageUrls: postForm.imageUrls,
            });
            const captionLowerCase = postForm.caption.toLowerCase();
            batch.set(postDocRef, {
                ...postForm,
                communityId: community?.id,
                captionLowerCase,
                createdAt: serverTimestamp() as Timestamp,
            });
            if (postImageUrls) {
                batch.update(postDocRef, {
                    imageUrls: postImageUrls,
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
                    collection(fireStore, firebaseRoute.getAllPostRoute()),
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
}

export default PostService;
