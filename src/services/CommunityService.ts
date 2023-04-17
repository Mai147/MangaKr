import { firebaseRoute } from "@/constants/firebaseRoutes";
import {
    CommunityRole,
    COMMUNITY_ADMIN_ROLE,
    COMMUNITY_MODERATOR_ROLE,
    COMMUNITY_SUPER_ADMIN_ROLE,
    COMMUNITY_USER_ROLE,
} from "@/constants/roles";
import { fireStore, storage } from "@/firebase/clientApp";
import { Community, CommunityType } from "@/models/Community";
import { Notification } from "@/models/Notification";
import {
    CommunityUserSnippet,
    UserCommunitySnippet,
    UserModel,
} from "@/models/User";
import CommunityUtlis from "@/utils/CommunityUtlis";
import FileUtils from "@/utils/FileUtils";
import { triGram } from "@/utils/StringUtils";
import UserUtils from "@/utils/UserUtils";
import {
    arrayUnion,
    collection,
    collectionGroup,
    doc,
    getDoc,
    getDocs,
    increment,
    limit,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
    where,
    writeBatch,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import NotificationService from "./NotificationService";

type AuthorizeInfo = {
    communityType: CommunityType;
    userRole?: CommunityRole;
    user?: UserModel | null;
};

type RecursiveRole = {
    role: CommunityRole;
    subRole?: RecursiveRole;
};

class CommunityService {
    static getAll = async ({
        communityOrders,
        communityLimit = 10,
    }: {
        communityOrders?: {
            communityOrderBy: string;
            communityOrderDirection: "asc" | "desc";
        }[];
        communityLimit?: number;
    }) => {
        const communityDocsRef = collection(
            fireStore,
            firebaseRoute.getAllCommunityRoute()
        );
        const communityConstraints = [];
        if (communityLimit) {
            communityConstraints.push(limit(communityLimit));
        }
        if (communityOrders) {
            communityOrders.forEach((communityOrder) => {
                communityConstraints.push(
                    orderBy(
                        communityOrder.communityOrderBy,
                        communityOrder.communityOrderDirection
                    )
                );
            });
        }
        const communityQuery = query(communityDocsRef, ...communityConstraints);
        const communityDocs = await getDocs(communityQuery);
        const communities = CommunityUtlis.fromDocs(communityDocs.docs);
        return communities;
    };

    static get = async ({ communityId }: { communityId: string }) => {
        const communityDocRef = doc(
            fireStore,
            firebaseRoute.getAllCommunityRoute(),
            communityId
        );
        const communityDoc = await getDoc(communityDocRef);
        if (communityDoc.exists()) {
            const moderatorSnippetDocsRef = collection(
                fireStore,
                firebaseRoute.getCommunityModeratorSnippetRoute(communityDoc.id)
            );
            const moderatorSnippetDocs = await getDocs(moderatorSnippetDocsRef);
            const moderatorSnippets = moderatorSnippetDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            const community = {
                ...CommunityUtlis.fromDoc(communityDoc),
                moderators: moderatorSnippets,
            } as Community;
            return community;
        }
    };

    static getRelated = async ({
        community,
        communityLimit = 3,
    }: {
        community: Community;
        communityLimit?: number;
    }) => {
        const communityDocsRef = collection(
            fireStore,
            firebaseRoute.getAllCommunityRoute()
        );
        const communityQuery = query(
            communityDocsRef,
            where("bookId", "==", community.bookId),
            where("id", "!=", community.id),
            limit(communityLimit)
        );
        const communityDocs = await getDocs(communityQuery);
        const communities = CommunityUtlis.fromDocs(communityDocs.docs);
        return communities;
    };

    static getUserRelated = async ({
        userId,
        communityLimit = 5,
    }: {
        userId: string;
        communityLimit?: number;
    }) => {
        const readingBookDocsRef = collection(
            fireStore,
            firebaseRoute.getUserReadingBookSnippetRoute(userId)
        );
        const readingBookQuery = query(
            readingBookDocsRef,
            limit(communityLimit)
        );
        const readingBookDocs = await getDocs(readingBookQuery);
        const communityDocsRef = collection(
            fireStore,
            firebaseRoute.getAllCommunityRoute()
        );
        let communityQuery;
        if (!readingBookDocs.empty) {
            const bookIds = readingBookDocs.docs.map((doc) => doc.id);
            communityQuery = query(
                communityDocsRef,
                where("bookId", "in", bookIds),
                limit(5)
            );
        } else {
            communityQuery = query(communityDocsRef, limit(5));
        }
        const communityDocs = await getDocs(communityQuery);
        const communities = communityDocs.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as Community)
        );
        return communities;
    };

    private static getFirstUserByRole = async ({
        communityId,
        queryConstraints,
        role,
        subRole,
    }: {
        communityId: string;
        queryConstraints: any[];
        role: CommunityRole;
        subRole?: RecursiveRole;
    }): Promise<CommunityUserSnippet | undefined> => {
        const communityUserDocsRef = collection(
            fireStore,
            firebaseRoute.getCommunityUserRoute(communityId)
        );
        const communityUserQuery = query(
            communityUserDocsRef,
            where("role", "==", role),
            ...queryConstraints
        );
        const communityUserDocs = await getDocs(communityUserQuery);
        if (!communityUserDocs.empty) {
            return {
                id: communityUserDocs.docs[0].id,
                ...communityUserDocs.docs[0].data(),
            } as CommunityUserSnippet;
        }
        if (subRole) {
            return await this.getFirstUserByRole({
                communityId,
                queryConstraints,
                role: subRole.role,
                subRole: subRole.subRole,
            });
        }
    };

    static findExpectedSuperAdmin = async ({
        communityId,
    }: {
        communityId: string;
    }) => {
        const queryConstraints = [];
        queryConstraints.push(where("isAccept", "==", true));
        queryConstraints.push(orderBy("createdAt", "asc"));
        queryConstraints.push(limit(1));
        const res = await this.getFirstUserByRole({
            communityId,
            queryConstraints,
            role: COMMUNITY_ADMIN_ROLE,
            subRole: {
                role: COMMUNITY_MODERATOR_ROLE,
                subRole: {
                    role: COMMUNITY_USER_ROLE,
                },
            },
        });
        return res;
    };

    static create = async ({
        user,
        communityForm,
    }: {
        user: UserModel;
        communityForm: Community;
    }) => {
        // Create the community in firestore
        try {
            // Check if community is not taken
            const batch = writeBatch(fireStore);
            const communityDocRef = doc(
                collection(fireStore, firebaseRoute.getAllCommunityRoute())
            );
            const userCommunitySnippetDocRef = doc(
                fireStore,
                firebaseRoute.getUserCommunitySnippetRoute(user.uid),
                communityDocRef.id
            );
            const moderatorSnippetDocRef = doc(
                fireStore,
                firebaseRoute.getCommunityModeratorSnippetRoute(
                    communityDocRef.id
                ),
                user.uid
            );
            const communityUserDocsRef = doc(
                fireStore,
                firebaseRoute.getCommunityUserRoute(communityDocRef.id),
                user.uid
            );
            const userCommunitySnippet: UserCommunitySnippet = {
                id: communityDocRef.id,
                name: communityForm.name,
                role: COMMUNITY_SUPER_ADMIN_ROLE,
                isAccept: true,
            };
            const userSnippet = UserUtils.toUserSnippet(user);
            const communityUserSnippet: CommunityUserSnippet = {
                ...userSnippet,
                role: COMMUNITY_SUPER_ADMIN_ROLE,
                isAccept: true,
                createdAt: serverTimestamp() as Timestamp,
            };
            batch.set(communityDocRef, {
                ...communityForm,
                id: communityDocRef.id,
                creatorId: user.uid,
                createdAt: serverTimestamp() as Timestamp,
                userIds: [user.uid],
            });
            batch.set(userCommunitySnippetDocRef, userCommunitySnippet);
            batch.set(communityUserDocsRef, communityUserSnippet);
            batch.set(moderatorSnippetDocRef, {
                id: user.uid,
                displayName: user.displayName,
                imageUrl: user.photoURL,
                role: COMMUNITY_SUPER_ADMIN_ROLE,
            });
            await batch.commit();
        } catch (err: any) {
            console.log("Create community Error", err);
        }
    };

    static update = async ({
        community,
        communityForm,
    }: {
        community: Community;
        communityForm: Community;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            const communityDocRef = doc(
                fireStore,
                firebaseRoute.getAllCommunityRoute(),
                communityForm.id!
            );
            let res;
            if (communityForm.imageUrl !== community?.imageUrl) {
                if (communityForm.imageUrl) {
                    res = await FileUtils.uploadFile({
                        imageRoute: firebaseRoute.getCommunityImageRoute(
                            community?.id!
                        ),
                        imageUrl: communityForm.imageUrl,
                    });
                }
                if (community.imageRef) {
                    await deleteObject(ref(storage, community.imageRef));
                }
            }
            const trigramName = triGram(communityForm.name);
            batch.update(communityDocRef, {
                ...communityForm,
                trigramName: trigramName.obj,
            });
            if (communityForm.imageUrl !== community?.imageUrl) {
                batch.update(communityDocRef, {
                    imageUrl: res?.downloadUrl,
                    imageRef: res?.downloadRef,
                });
            }
            await batch.commit();
            return {
                ...communityForm,
                imageUrl: res?.downloadUrl || communityForm.imageUrl,
                imageRef: res?.downloadRef || communityForm.imageRef,
            };
        } catch (error) {
            console.log(error);
        }
    };

    static join = async ({
        community,
        user,
    }: {
        user: UserModel;
        community: Community;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            const communityUserDocsRef = doc(
                fireStore,
                firebaseRoute.getCommunityUserRoute(community.id!),
                user.uid
            );
            const userCommunitySnippetDocRef = doc(
                fireStore,
                firebaseRoute.getUserCommunitySnippetRoute(user.uid),
                community.id!
            );
            const userSnippet = UserUtils.toUserSnippet(user);
            const communityUserSnippet: CommunityUserSnippet = {
                ...userSnippet,
                role: COMMUNITY_USER_ROLE,
                isAccept: false,
                createdAt: serverTimestamp() as Timestamp,
            };
            const userCommunitySnippet: UserCommunitySnippet = {
                id: community.id!,
                name: community.name!,
                role: COMMUNITY_USER_ROLE,
                isAccept: false,
            };
            const trigramName = triGram(user.displayName!);
            batch.set(communityUserDocsRef, {
                ...communityUserSnippet,
                trigramName: trigramName.obj,
            });
            batch.set(userCommunitySnippetDocRef, userCommunitySnippet);
            await batch.commit();
            return {
                isAccept: false,
                role: undefined,
            };
        } catch (error) {
            console.log(error);
        }
    };

    static leave = async ({
        communityId,
        userId,
        userRole,
    }: {
        userId: string;
        communityId: string;
        userRole?: CommunityRole;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            const communityDocRef = doc(
                fireStore,
                firebaseRoute.getAllCommunityRoute(),
                communityId
            );
            if (userRole === COMMUNITY_SUPER_ADMIN_ROLE) {
                const expectedSuperAdmin = await this.findExpectedSuperAdmin({
                    communityId,
                });
                if (expectedSuperAdmin) {
                    const communityExpectedSuperAdminDocRef = doc(
                        collection(
                            fireStore,
                            firebaseRoute.getCommunityUserRoute(communityId)
                        ),
                        expectedSuperAdmin.id
                    );
                    const expectedSuperAdminCommunityDocRef = doc(
                        fireStore,
                        firebaseRoute.getUserCommunitySnippetRoute(
                            expectedSuperAdmin.id
                        ),
                        communityId
                    );
                    batch.update(communityExpectedSuperAdminDocRef, {
                        role: COMMUNITY_SUPER_ADMIN_ROLE,
                    });
                    batch.update(expectedSuperAdminCommunityDocRef, {
                        role: COMMUNITY_SUPER_ADMIN_ROLE,
                    });
                } else {
                    const userCommunitySnippetsDocsRef = collectionGroup(
                        fireStore,
                        firebaseRoute.COMMUNITY_SNIPPET_ROUTE
                    );
                    const userCommunitySnippetsQuery = query(
                        userCommunitySnippetsDocsRef,
                        where("id", "==", communityId)
                    );
                    const userCommunitySnippetsDocs = await getDocs(
                        userCommunitySnippetsQuery
                    );
                    userCommunitySnippetsDocs.docs.forEach((doc) => {
                        batch.delete(doc.ref);
                    });
                    batch.delete(communityDocRef);
                    await batch.commit();
                    return;
                }
            }
            const communityUserDocRef = doc(
                collection(
                    fireStore,
                    firebaseRoute.getCommunityUserRoute(communityId)
                ),
                userId
            );
            const userCommunityDocRef = doc(
                fireStore,
                firebaseRoute.getUserCommunitySnippetRoute(userId),
                communityId
            );

            batch.update(communityDocRef, {
                numberOfMembers: increment(-1),
            });
            batch.delete(communityUserDocRef);
            batch.delete(userCommunityDocRef);
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };

    static approveUser = async ({
        userId,
        community,
        isAccept,
    }: {
        userId: string;
        community: Community;
        isAccept: boolean;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            const communityUserDocRef = doc(
                collection(
                    fireStore,
                    firebaseRoute.getCommunityUserRoute(community.id!)
                ),
                userId
            );
            const userCommunityDocRef = doc(
                fireStore,
                firebaseRoute.getUserCommunitySnippetRoute(userId),
                community.id!
            );
            const communityDocRef = doc(
                fireStore,
                firebaseRoute.getAllCommunityRoute(),
                community.id!
            );
            if (isAccept) {
                const notification: Notification = {
                    id: community.id!,
                    creatorDisplayName: community.name,
                    imageUrl: community.imageUrl,
                    content: "đã chấp nhận yêu cầu gia nhập của bạn",
                    isSeen: false,
                    isRead: true,
                    type: "COMMUNITY_APPROVE",
                    createdAt: serverTimestamp() as Timestamp,
                };
                await NotificationService.updateOrCreate({
                    notification,
                    userId,
                });
                batch.update(communityDocRef, {
                    numberOfMembers: increment(1),
                    userIds: arrayUnion(userId),
                });
                batch.update(communityUserDocRef, {
                    isAccept: true,
                    createdAt: serverTimestamp() as Timestamp,
                });
                batch.update(userCommunityDocRef, {
                    isAccept: true,
                });
            } else {
                batch.delete(communityUserDocRef);
                batch.delete(userCommunityDocRef);
            }
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };

    static changeUserRole = async ({
        communityId,
        newRole,
        userId,
    }: {
        communityId: string;
        userId: string;
        newRole: CommunityRole;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            const communityUserDocRef = doc(
                collection(
                    fireStore,
                    firebaseRoute.getCommunityUserRoute(communityId)
                ),
                userId
            );
            const userCommunityDocRef = doc(
                fireStore,
                firebaseRoute.getUserCommunitySnippetRoute(userId),
                communityId
            );
            batch.update(communityUserDocRef, {
                role: newRole,
            });
            batch.update(userCommunityDocRef, {
                role: newRole,
            });
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };

    static getUserRole = async ({
        communityId,
        userId,
    }: {
        communityId: string;
        userId: string;
    }) => {
        const userCommunityDocRef = doc(
            fireStore,
            firebaseRoute.getUserCommunitySnippetRoute(userId),
            communityId
        );
        const userCommunityDoc = await getDoc(userCommunityDocRef);
        if (userCommunityDoc.exists()) {
            const { role, isAccept } =
                userCommunityDoc.data() as UserCommunitySnippet;
            return {
                isAccept,
                role: isAccept ? role : undefined,
            };
        }
    };

    static canViewPosts = ({
        communityType,
        userRole,
        user,
    }: AuthorizeInfo) => {
        return CommunityUtlis.checkAuthorization({
            requestedRole: {
                publicRequestedRole: {
                    isAuthenticated: false,
                    roles: [],
                },
                restrictedRequestedRole: {
                    isAuthenticated: true,
                    roles: [],
                },
                privateRequestedRole: {
                    isAuthenticated: true,
                    roles: [
                        "COMMUNITY_USER",
                        "COMMUNITY_MODERATOR",
                        "COMMUNITY_ADMIN",
                        "COMMUNITY_SUPER_ADMIN",
                    ],
                },
            },
            communityType,
            user,
            userRole,
        });
    };

    static canCreatePosts = ({
        communityType,
        userRole,
        user,
    }: AuthorizeInfo) => {
        return CommunityUtlis.checkAuthorization({
            requestedRole: {
                publicRequestedRole: {
                    isAuthenticated: true,
                    roles: [],
                },
                restrictedRequestedRole: {
                    isAuthenticated: true,
                    roles: [
                        "COMMUNITY_USER",
                        "COMMUNITY_MODERATOR",
                        "COMMUNITY_ADMIN",
                        "COMMUNITY_SUPER_ADMIN",
                    ],
                },
                privateRequestedRole: {
                    isAuthenticated: true,
                    roles: [
                        "COMMUNITY_USER",
                        "COMMUNITY_MODERATOR",
                        "COMMUNITY_ADMIN",
                        "COMMUNITY_SUPER_ADMIN",
                    ],
                },
            },
            communityType,
            user,
            userRole,
        });
    };

    static canUpdateCommunnity = ({
        communityType,
        userRole,
        user,
    }: AuthorizeInfo) => {
        return CommunityUtlis.checkAuthorization({
            requestedRole: {
                publicRequestedRole: {
                    isAuthenticated: true,
                    roles: ["COMMUNITY_ADMIN", "COMMUNITY_SUPER_ADMIN"],
                },
                restrictedRequestedRole: {
                    isAuthenticated: true,
                    roles: ["COMMUNITY_ADMIN", "COMMUNITY_SUPER_ADMIN"],
                },
                privateRequestedRole: {
                    isAuthenticated: true,
                    roles: ["COMMUNITY_ADMIN", "COMMUNITY_SUPER_ADMIN"],
                },
            },
            communityType,
            user,
            userRole,
        });
    };

    static canApprovePost = ({
        communityType,
        userRole,
        user,
    }: AuthorizeInfo) => {
        return CommunityUtlis.checkAuthorization({
            requestedRole: {
                publicRequestedRole: {
                    isAuthenticated: true,
                    roles: [
                        "COMMUNITY_MODERATOR",
                        "COMMUNITY_ADMIN",
                        "COMMUNITY_SUPER_ADMIN",
                    ],
                },
                restrictedRequestedRole: {
                    isAuthenticated: true,
                    roles: [
                        "COMMUNITY_MODERATOR",
                        "COMMUNITY_ADMIN",
                        "COMMUNITY_SUPER_ADMIN",
                    ],
                },
                privateRequestedRole: {
                    isAuthenticated: true,
                    roles: [
                        "COMMUNITY_MODERATOR",
                        "COMMUNITY_ADMIN",
                        "COMMUNITY_SUPER_ADMIN",
                    ],
                },
            },
            communityType,
            user,
            userRole,
        });
    };

    static canApproveUser = ({
        communityType,
        user,
        userRole,
    }: AuthorizeInfo) => {
        return CommunityUtlis.checkAuthorization({
            requestedRole: {
                publicRequestedRole: {
                    isAuthenticated: true,
                    roles: ["COMMUNITY_ADMIN", "COMMUNITY_SUPER_ADMIN"],
                },
                restrictedRequestedRole: {
                    isAuthenticated: true,
                    roles: ["COMMUNITY_ADMIN", "COMMUNITY_SUPER_ADMIN"],
                },
                privateRequestedRole: {
                    isAuthenticated: true,
                    roles: ["COMMUNITY_ADMIN", "COMMUNITY_SUPER_ADMIN"],
                },
            },
            communityType,
            user,
            userRole,
        });
    };

    static canAuthorize = ({
        communityType,
        userRole,
        user,
    }: AuthorizeInfo) => {
        return CommunityUtlis.checkAuthorization({
            requestedRole: {
                publicRequestedRole: {
                    isAuthenticated: true,
                    roles: ["COMMUNITY_ADMIN", "COMMUNITY_SUPER_ADMIN"],
                },
                restrictedRequestedRole: {
                    isAuthenticated: true,
                    roles: ["COMMUNITY_ADMIN", "COMMUNITY_SUPER_ADMIN"],
                },
                privateRequestedRole: {
                    isAuthenticated: true,
                    roles: ["COMMUNITY_ADMIN", "COMMUNITY_SUPER_ADMIN"],
                },
            },
            communityType,
            user,
            userRole,
        });
    };

    static canAuthorizeAdmin = ({
        communityType,
        userRole,
        user,
    }: AuthorizeInfo) => {
        return CommunityUtlis.checkAuthorization({
            requestedRole: {
                publicRequestedRole: {
                    isAuthenticated: true,
                    roles: ["COMMUNITY_SUPER_ADMIN"],
                },
                restrictedRequestedRole: {
                    isAuthenticated: true,
                    roles: ["COMMUNITY_SUPER_ADMIN"],
                },
                privateRequestedRole: {
                    isAuthenticated: true,
                    roles: ["COMMUNITY_SUPER_ADMIN"],
                },
            },
            communityType,
            user,
            userRole,
        });
    };

    static updateNotification = async ({
        community,
        creatorDisplayName,
        type,
    }: {
        community: Community;
        creatorDisplayName: string;
        type: "POST" | "TOPIC" | "VOTING";
    }) => {
        const communityUserDocsRef = collection(
            fireStore,
            firebaseRoute.getCommunityUserRoute(community.id!)
        );
        const communityUserDocs = await getDocs(communityUserDocsRef);
        const communityUserIds = communityUserDocs.docs.map((doc) => doc.id);
        for (const id of communityUserIds) {
            const notification: Notification = {
                id: community.id,
                creatorDisplayName,
                imageUrl: community.imageUrl,
                content: `đã đăng 1 ${
                    type === "POST"
                        ? "bài viết"
                        : type === "TOPIC"
                        ? "chủ đề"
                        : "cuộc bình chọn"
                } mới trong`,
                targetName: community.name,
                isSeen: false,
                isRead: false,
                type: "COMMUNITY_POST",
                createdAt: serverTimestamp() as Timestamp,
            };
            await NotificationService.updateOrCreate({
                notification,
                userId: id,
            });
        }
    };

    // static updateUserLatestPost = async (
    //     userId: string,
    //     community: Community
    // ) => {
    //     try {
    //         const userCommunityDocRef = doc(
    //             fireStore,
    //             firebaseRoute.getUserCommunitySnippetRoute(userId),
    //             community.id!
    //         );
    //         const res = await getDoc(userCommunityDocRef);
    //         if (res.exists()) {
    //             await updateDoc(
    //                 userCommunityDocRef,
    //                 "latestPost",
    //                 community.latestPost
    //             );
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
}

export default CommunityService;
