import { firebaseRoute } from "@/constants/firebaseRoutes";
import { PrivacyType } from "@/constants/privacy";
import { CommunityRole } from "@/constants/roles";
import { routes } from "@/constants/routes";
import { fireStore, storage } from "@/firebase/clientApp";
import { Community } from "@/models/Community";
import { Notification } from "@/models/Notification";
import { LatestPost, Post, SharingPost } from "@/models/Post";
import { UserModel } from "@/models/User";
import FileUtils from "@/utils/FileUtils";
import PostUtils from "@/utils/PostUtils";
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
    getDoc,
    runTransaction,
    limit,
    orderBy,
    getCountFromServer,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import CommunityService from "./CommunityService";
import NotificationService from "./NotificationService";

class PostService {
    static getAll = async ({
        postOrders,
        postLimit,
    }: {
        postOrders?: {
            postOrderBy: string;
            postOrderDirection: "desc" | "asc";
        }[];
        postLimit?: number;
    }) => {
        const postDocsRef = collectionGroup(fireStore, "posts");
        const postConstraints = [];
        if (postLimit) {
            postConstraints.push(limit(postLimit));
        }
        if (postOrders) {
            postOrders.forEach((postOrder) => {
                postConstraints.push(
                    orderBy(postOrder.postOrderBy, postOrder.postOrderDirection)
                );
            });
        }
        const postQuery = query(postDocsRef, ...postConstraints);
        const postDocs = await getDocs(postQuery);
        const posts: Post[] = postDocs.docs.map((postDoc) => ({
            ...(postDoc.data() as Post),
        }));
        return posts;
    };
    static get = async ({
        postId,
        communityId,
        userId,
        isAccept,
        isLock,
    }: {
        postId: string;
        communityId?: string;
        userId?: string;
        isAccept?: boolean;
        isLock?: boolean;
    }) => {
        let postDocRef;
        if (communityId) {
            postDocRef = doc(
                fireStore,
                firebaseRoute.getCommunityPostRoute(communityId),
                postId
            );
        } else if (userId) {
            postDocRef = doc(
                fireStore,
                firebaseRoute.getUserPostRoute(userId),
                postId
            );
        } else {
            return;
        }
        const postDoc = await getDoc(postDocRef);
        if (postDoc.exists()) {
            const post = PostUtils.fromDoc(postDoc);
            if (isAccept !== undefined && post.isAccept !== isAccept) return;
            if (isLock !== undefined && post.isLock !== isLock) return;
            return post;
        }
    };
    static create = async ({
        postForm,
        community,
        userRole,
    }: {
        postForm: Post;
        community?: Community;
        userRole?: CommunityRole;
    }) => {
        try {
            await runTransaction(fireStore, async (transaction) => {
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
                const videoRes = await FileUtils.uploadVideo({
                    videoRoute: firebaseRoute.getPostVideoRoute(postDocRef.id),
                    videoUrl: postForm.videoUrl,
                });
                transaction.set(postDocRef, {
                    ...postForm,
                    imageUrls: [],
                    imageRefs: [],
                    videoUrl: undefined,
                    videoRef: undefined,
                    communityId: community?.id,
                    isAccept: community?.id ? false : true,
                    createdAt: serverTimestamp() as Timestamp,
                });
                transaction.update(rootDocRef, {
                    numberOfPosts: increment(1),
                });
                if (res) {
                    transaction.update(postDocRef, {
                        imageUrls: res.downloadUrls,
                        imageRefs: res.downloadRefs,
                    });
                }
                if (videoRes) {
                    transaction.update(postDocRef, {
                        videoUrl: videoRes.downloadUrl,
                        videoRef: videoRes.downloadRef,
                    });
                }
                if (
                    (community && userRole === "COMMUNITY_ADMIN") ||
                    userRole === "COMMUNITY_MODERATOR" ||
                    userRole === "COMMUNITY_SUPER_ADMIN"
                ) {
                    transaction.update(postDocRef, {
                        isAccept: true,
                    });
                }
                // Notification
                if (!community) {
                    if (postForm.privacyType !== "ONLYME_PRIVACY") {
                        const followedDocsRef = collection(
                            fireStore,
                            firebaseRoute.getUserFollowedRoute(
                                postForm.creatorId
                            )
                        );
                        const followedDocs = await getDocs(followedDocsRef);
                        const followedIds = followedDocs.docs.map(
                            (doc) => doc.id
                        );
                        for (const id of followedIds) {
                            const notification: Notification = {
                                id: postForm.creatorId,
                                creatorDisplayName:
                                    postForm.creatorDisplayName!,
                                imageUrl: postForm.creatorImageUrl,
                                content:
                                    "đã đăng 1 bài viết mới trên trang cá nhân",
                                isSeen: false,
                                isRead: false,
                                type: "FOLLOWED_POST",
                                createdAt: serverTimestamp() as Timestamp,
                            };
                            await NotificationService.updateOrCreate({
                                notification,
                                userId: id,
                            });
                        }
                    }
                }
            });
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
                    batch.update(communityDocRef, {
                        numberOfPosts: increment(1),
                    });
                    // Community noti
                    await CommunityService.updateNotification({
                        community,
                        creatorDisplayName: post.creatorDisplayName!,
                        type: "POST",
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
    static toggleLockState = async ({
        post,
        communityId,
    }: {
        post: Post;
        communityId?: string;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            let postDocRef;
            if (communityId) {
                postDocRef = doc(
                    collection(
                        fireStore,
                        firebaseRoute.getCommunityPostRoute(communityId)
                    ),
                    post.id
                );
            } else {
                postDocRef = doc(
                    collection(
                        fireStore,
                        firebaseRoute.getUserPostRoute(post.creatorId)
                    ),
                    post.id
                );
            }
            batch.update(postDocRef, {
                isLock: !post.isLock,
            });
            // Notification
            let notification: Notification;
            if (!post.isLock) {
                notification = {
                    id: post.id,
                    content:
                        "Bài viết của bạn đã bị khóa do vi phạm tiêu chuẩn cộng đồng",
                    isSeen: false,
                    isRead: true,
                    type: "POST_LOCK",
                    createdAt: serverTimestamp() as Timestamp,
                };
            } else {
                notification = {
                    id: post.id,
                    content: "Bài viết của bạn đã được mở khóa",
                    isSeen: false,
                    isRead: true,
                    type: "POST_LOCK",
                    createdAt: serverTimestamp() as Timestamp,
                };
            }
            await NotificationService.updateOrCreate({
                notification,
                userId: post.creatorId,
            });
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
            if (post.videoRef) {
                await deleteObject(ref(storage, post.videoRef));
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
            const sharingPostDocsRef = collectionGroup(
                fireStore,
                "sharingPosts"
            );
            const sharingPostDocs = await getDocs(sharingPostDocsRef);
            sharingPostDocs.docs.map((sharingDoc) => {
                batch.delete(sharingDoc.ref);
            });
            batch.delete(postDocRef);
            batch.update(rootDocRef, {
                numberOfPosts: increment(-1),
            });
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };
    static changePrivacy = async ({
        postId,
        privacy,
        userId,
    }: {
        postId: string;
        userId: string;
        privacy: PrivacyType;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            const postDocRef = doc(
                fireStore,
                firebaseRoute.getUserPostRoute(userId),
                postId
            );
            batch.update(postDocRef, {
                privacyType: privacy,
            });
            await batch.commit();
            return privacy;
        } catch (error) {
            console.log(error);
        }
    };
    static share = async ({
        post,
        user,
        communityId,
    }: {
        user: UserModel;
        post: Post;
        communityId?: string;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            const sharingDocRef = doc(
                fireStore,
                firebaseRoute.getUserSharingPostRoute(user.uid),
                post.id!
            );
            const sharingPost: SharingPost = {
                ...post,
                sharingUserId: user.uid,
                sharingUserDisplayName: user.displayName!,
                sharingUserImageUrl: user.photoURL,
                sharingCreatedAt: serverTimestamp() as Timestamp,
                url: communityId
                    ? routes.getCommunityPostDetailPage(communityId, post.id!)
                    : routes.getPostDetailPage(post.creatorId, post.id!),
            };
            batch.set(sharingDocRef, sharingPost);

            //Notification
            const followedDocsRef = collection(
                fireStore,
                firebaseRoute.getUserFollowedRoute(user.uid)
            );
            const followedDocs = await getDocs(followedDocsRef);
            const followedIds = followedDocs.docs.map((doc) => doc.id);
            for (const id of followedIds) {
                const notification: Notification = {
                    id: sharingPost.creatorId,
                    creatorDisplayName: sharingPost.sharingUserDisplayName!,
                    imageUrl: sharingPost.sharingUserImageUrl,
                    content: "đã chia sẻ 1 bài viết",
                    isSeen: false,
                    isRead: false,
                    type: "FOLLOWED_SHARE",
                    createdAt: serverTimestamp() as Timestamp,
                };
                await NotificationService.updateOrCreate({
                    notification,
                    userId: id,
                });
            }
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };
    static isShared = async ({
        postId,
        userId,
    }: {
        postId: string;
        userId: string;
    }) => {
        const sharingDocRef = doc(
            fireStore,
            firebaseRoute.getUserSharingPostRoute(userId),
            postId
        );
        const sharingPost = await getDoc(sharingDocRef);
        return sharingPost.exists() ? true : false;
    };
    static count = async ({ isToday }: { isToday: boolean }) => {
        const postDocsRef = collectionGroup(fireStore, "posts");
        let queryConstraints = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tommorow = new Date(today);
        tommorow.setDate(tommorow.getDate() + 1);
        if (isToday) {
            queryConstraints.push(
                where("createdAt", ">=", Timestamp.fromDate(today)),
                where("createdAt", "<=", Timestamp.fromDate(tommorow))
            );
        }
        const snapShot = await getCountFromServer(
            query(postDocsRef, ...queryConstraints)
        );
        return snapShot.data().count;
    };
}

export default PostService;
