import { ProfileFormState } from "@/components/Profile/Edit/Detail";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { Role, USER_ROLE } from "@/constants/roles";
import { fireStore, storage } from "@/firebase/clientApp";
import { Follow, UserModel, UserSnippet } from "@/models/User";
import FileUtils from "@/utils/FileUtils";
import { triGram } from "@/utils/StringUtils";
import { updateProfile, User } from "firebase/auth";
import { v4 } from "uuid";
import {
    collection,
    collectionGroup,
    doc,
    getCountFromServer,
    getDoc,
    getDocs,
    increment,
    limit,
    orderBy,
    query,
    runTransaction,
    serverTimestamp,
    setDoc,
    Timestamp,
    where,
    WriteBatch,
    writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { Notification } from "@/models/Notification";
import NotificationService from "./NotificationService";

class UserService {
    static getAll = async ({
        userOrders,
        userLimit,
    }: {
        userOrders?: {
            userOrderBy: string;
            userOrderDirection: "desc" | "asc";
        }[];
        userLimit?: number;
    }) => {
        const userDocsRef = collection(
            fireStore,
            firebaseRoute.getAllUserRoute()
        );
        const userConstraints = [];
        if (userLimit) {
            userConstraints.push(limit(userLimit));
        }
        if (userOrders) {
            userOrders.forEach((userOrder) => {
                userConstraints.push(
                    orderBy(userOrder.userOrderBy, userOrder.userOrderDirection)
                );
            });
        }
        const userQuery = query(userDocsRef, ...userConstraints);
        const userDocs = await getDocs(userQuery);
        const users: UserModel[] = userDocs.docs.map((userDoc) => ({
            ...(userDoc.data() as UserModel),
        }));
        return users;
    };
    static get = async ({ userId }: { userId: string }) => {
        const userDocRef = doc(
            fireStore,
            firebaseRoute.getAllUserRoute(),
            userId
        );
        const userDoc = await getDoc(userDocRef);
        const user: UserModel = {
            id: userId,
            ...(userDoc.data() as UserModel),
        } as UserModel;
        return user;
    };
    static create = async ({ user }: { user: User }) => {
        const displayName =
            user.displayName ||
            user.email?.split("@")[0] ||
            `User ${v4().split("-")[0]}`;
        const trigramName = triGram(displayName);
        await setDoc(
            doc(fireStore, firebaseRoute.getAllUserRoute(), user?.uid),
            {
                ...JSON.parse(JSON.stringify(user)),
                role: USER_ROLE,
                displayName,
                imageUrl: user.photoURL,
                trigramName: trigramName.obj,
                numberOfPosts: 0,
                numberOfFollows: 0,
                numberOfFolloweds: 0,
                createdAt: serverTimestamp() as Timestamp,
            }
        );
    };
    static update = async ({
        profileForm,
        user,
        avatarChange,
    }: {
        profileForm: ProfileFormState;
        user: User;
        avatarChange: boolean;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            await updateProfile(user, {
                displayName: profileForm.displayName,
            });
            let downloadUrl;
            let downloadRef;
            if (avatarChange) {
                const res = await FileUtils.uploadFile({
                    imageRoute: firebaseRoute.getUserImageRoute(
                        profileForm.id!
                    ),
                    imageUrl: profileForm.photoUrl,
                });
                downloadUrl = res?.downloadUrl;
                downloadRef = res?.downloadRef;
                if (profileForm.imageRef) {
                    await deleteObject(ref(storage, profileForm.imageRef));
                }
                await updateProfile(user, {
                    photoURL: res?.downloadUrl,
                });
            }
            const userDocRef = doc(
                fireStore,
                firebaseRoute.getAllUserRoute(),
                profileForm.id!
            );
            const trigramName = triGram(profileForm.displayName);
            batch.update(userDocRef, {
                displayName: profileForm.displayName,
                bio: profileForm.bio,
                trigramName: trigramName.obj,
            });
            if (avatarChange) {
                batch.update(userDocRef, {
                    photoURL: downloadUrl,
                    imageUrl: downloadUrl,
                    imageRef: downloadRef,
                });
            }
            // Update username, image url in comments, reviews, etc..
            await this.updateSnippet({
                batch,
                route: firebaseRoute.getAllReviewRoute(),
                userId: profileForm.id!,
                newValue: {
                    creatorDisplayName: profileForm.displayName,
                },
            });

            await this.updateSnippet({
                batch,
                route: "comments",
                userId: profileForm.id!,
                newValue: {
                    creatorDisplayName: profileForm.displayName,
                    creatorImageUrl: downloadUrl,
                },
            });
            await this.updateSnippet({
                batch,
                route: "topics",
                userId: profileForm.id!,
                newValue: {
                    creatorDisplayName: profileForm.displayName,
                    creatorImageUrl: downloadUrl,
                },
            });
            await this.updateSnippet({
                batch,
                route: "posts",
                userId: profileForm.id!,
                newValue: {
                    creatorDisplayName: profileForm.displayName,
                    creatorImageUrl: downloadUrl,
                },
            });
            await this.updateSnippet({
                batch,
                route: "genres",
                userId: profileForm.id!,
                newValue: {
                    creatorDisplayName: profileForm.displayName,
                },
            });
            await this.updateSnippet({
                batch,
                route: "authors",
                userId: profileForm.id!,
                newValue: {
                    creatorDisplayName: profileForm.displayName,
                },
            });
            await this.updateSnippet({
                batch,
                route: "userSnippets",
                idField: "id",
                userId: profileForm.id!,
                newValue: {
                    displayName: profileForm.displayName,
                    imageUrl: downloadUrl,
                },
            });
            await this.updateSnippet({
                batch,
                route: "messages",
                idField: "id",
                userId: profileForm.id!,
                newValue: {
                    displayName: profileForm.displayName,
                    imageUrl: downloadUrl,
                },
            });
            await this.updateSnippet({
                batch,
                route: "votings",
                userId: profileForm.id!,
                newValue: {
                    creatorDisplayName: profileForm.displayName,
                    creatorImageUrl: downloadUrl,
                },
            });
            await this.updateSnippet({
                batch,
                route: "notifications",
                idField: "id",
                userId: profileForm.id!,
                newValue: {
                    creatorDisplayName: profileForm.displayName,
                    imageUrl: downloadUrl,
                },
            });
            await this.updateSnippet({
                batch,
                route: "follows",
                idField: "id",
                userId: profileForm.id!,
                newValue: {
                    displayName: profileForm.displayName,
                    imageUrl: downloadUrl,
                },
            });
            await this.updateSnippet({
                batch,
                route: "followeds",
                idField: "id",
                userId: profileForm.id!,
                newValue: {
                    displayName: profileForm.displayName,
                    imageUrl: downloadUrl,
                },
            });
            await this.updateSnippet({
                batch,
                route: "sharingPosts",
                userId: profileForm.id!,
                newValue: {
                    creatorDisplayName: profileForm.displayName,
                    creatorImageUrl: downloadUrl,
                },
            });
            await this.updateSnippet({
                batch,
                route: "optionVotingVotes",
                userId: profileForm.id!,
                idField: "id",
                newValue: {
                    displayName: profileForm.displayName,
                    imageUrl: downloadUrl,
                },
            });
            await batch.commit();
            return {
                ...profileForm,
                photoUrl: downloadUrl,
            };
        } catch (error) {
            console.log(error);
        }
    };
    private static updateSnippet = async ({
        batch,
        route,
        newValue,
        idField = "creatorId",
        userId,
    }: {
        batch: WriteBatch;
        route: string;
        newValue: {
            [x: string]: any;
        };
        idField?: string;
        userId: string;
    }) => {
        const docsRef = collectionGroup(fireStore, route);
        const docsQuery = query(docsRef, where(idField, "==", userId));
        const docs = await getDocs(docsQuery);
        docs.docs.forEach((doc) => {
            if (doc.exists()) {
                batch.update(doc.ref, newValue);
            }
        });
    };
    static getFollow = async ({
        followerId,
        userId,
    }: {
        userId: string;
        followerId: string;
    }) => {
        const userFollowDocRef = doc(
            fireStore,
            firebaseRoute.getUserFollowRoute(userId),
            followerId
        );
        const userFollowDoc = await getDoc(userFollowDocRef);
        if (userFollowDoc.exists()) {
            return {
                id: userFollowDoc.id,
                ...userFollowDoc.data(),
            } as Follow;
        }
    };
    static follow = async ({
        user,
        follower,
    }: {
        user: UserModel;
        follower: UserModel;
    }) => {
        if (user.uid === follower.uid) return;
        try {
            return await runTransaction(fireStore, async (transaction) => {
                const followerFollowedDocRef = doc(
                    fireStore,
                    firebaseRoute.getUserFollowedRoute(follower.uid),
                    user.uid
                );
                const userFollowDocRef = doc(
                    fireStore,
                    firebaseRoute.getUserFollowRoute(user.uid),
                    follower.uid
                );
                const followerFollow: Follow = {
                    id: user.uid,
                    displayName: user.displayName!,
                    imageUrl: user.photoURL,
                    isAccept: false,
                    createdAt: serverTimestamp() as Timestamp,
                };
                const userFollow: Follow = {
                    id: follower.uid,
                    displayName: follower.displayName!,
                    imageUrl: follower.photoURL,
                    isAccept: false,
                    createdAt: serverTimestamp() as Timestamp,
                };
                const notification: Notification = {
                    id: user.uid,
                    creatorDisplayName: user.displayName!,
                    imageUrl: user.photoURL,
                    content: "đã yêu cầu theo dõi bạn",
                    isSeen: false,
                    isRead: true,
                    type: "FOLLOW_REQUEST",
                    createdAt: serverTimestamp() as Timestamp,
                };
                await NotificationService.updateOrCreate({
                    notification,
                    userId: follower.uid,
                    transaction,
                });
                transaction.set(followerFollowedDocRef, followerFollow);
                transaction.set(userFollowDocRef, userFollow);
                return userFollow;
            });
        } catch (error) {
            console.log(error);
        }
    };
    static unfollow = async ({
        followerId,
        userId,
    }: {
        userId: string;
        followerId: string;
    }) => {
        //  A -> follow B
        //  user: A
        //  follower: B
        try {
            const batch = writeBatch(fireStore);
            const userFollowDocRef = doc(
                fireStore,
                firebaseRoute.getUserFollowRoute(userId),
                followerId
            );
            const followerFollowedDocRef = doc(
                fireStore,
                firebaseRoute.getUserFollowedRoute(followerId),
                userId
            );
            const userDocRef = doc(
                fireStore,
                firebaseRoute.getAllUserRoute(),
                userId
            );
            const followerDocRef = doc(
                fireStore,
                firebaseRoute.getAllUserRoute(),
                followerId
            );
            batch.delete(userFollowDocRef);
            batch.delete(followerFollowedDocRef);
            batch.update(userDocRef, {
                numberOfFollows: increment(-1),
            });
            batch.update(followerDocRef, {
                numberOfFolloweds: increment(-1),
            });
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };
    static acceptFollow = async ({
        follower,
        userId,
    }: {
        follower: UserSnippet;
        userId: string;
    }) => {
        try {
            //  A -> request to B
            //  user: A
            //  follower: B
            await runTransaction(fireStore, async (transaction) => {
                const followerFollowedDocRef = doc(
                    fireStore,
                    firebaseRoute.getUserFollowedRoute(follower.id),
                    userId
                );
                const userFollowDocRef = doc(
                    fireStore,
                    firebaseRoute.getUserFollowRoute(userId),
                    follower.id
                );
                const userDocRef = doc(
                    fireStore,
                    firebaseRoute.getAllUserRoute(),
                    userId
                );
                const followerDocRef = doc(
                    fireStore,
                    firebaseRoute.getAllUserRoute(),
                    follower.id
                );
                const userNotification: Notification = {
                    id: follower.id!,
                    creatorDisplayName: follower.displayName!,
                    imageUrl: follower.imageUrl,
                    content: "đã chấp nhận yêu cầu theo dõi của bạn",
                    isSeen: false,
                    isRead: true,
                    type: "FOLLOW_ACCEPT",
                    createdAt: serverTimestamp() as Timestamp,
                };
                await NotificationService.updateOrCreate({
                    notification: userNotification,
                    userId,
                    transaction,
                });
                transaction.update(followerFollowedDocRef, {
                    isAccept: true,
                });
                transaction.update(userFollowDocRef, {
                    isAccept: true,
                });
                transaction.update(userDocRef, {
                    numberOfFollows: increment(1),
                });
                transaction.update(followerDocRef, {
                    numberOfFolloweds: increment(1),
                });
                await NotificationService.delete({
                    notificationId: userId,
                    userId: follower.id,
                    transaction,
                });
            });
        } catch (error) {
            console.log(error);
        }
    };
    static declineFollow = async ({
        followerId,
        userId,
    }: {
        followerId: string;
        userId: string;
    }) => {
        try {
            //  A -> request to B
            //  user: A
            //  follower: B
            await runTransaction(fireStore, async (transaction) => {
                const followerFollowedDocRef = doc(
                    fireStore,
                    firebaseRoute.getUserFollowedRoute(followerId),
                    userId
                );
                const userFollowDocRef = doc(
                    fireStore,
                    firebaseRoute.getUserFollowRoute(userId),
                    followerId
                );
                transaction.delete(followerFollowedDocRef);
                transaction.delete(userFollowDocRef);
                await NotificationService.delete({
                    notificationId: userId,
                    userId: followerId,
                    transaction,
                });
            });
        } catch (error) {
            console.log(error);
        }
    };
    static count = async ({ isToday }: { isToday: boolean }) => {
        const userDocsRef = collection(
            fireStore,
            firebaseRoute.getAllUserRoute()
        );
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
            query(userDocsRef, ...queryConstraints)
        );
        return snapShot.data().count;
    };
    static changeUserRole = async ({
        newRole,
        userId,
    }: {
        userId: string;
        newRole: Role;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            const userDocRef = doc(
                collection(fireStore, firebaseRoute.getAllUserRoute()),
                userId
            );
            batch.update(userDocRef, {
                role: newRole,
            });
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };
}

export default UserService;
