import { ProfileFormState } from "@/components/Profile/Detail";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { USER_ROLE } from "@/constants/roles";
import { fireStore, storage } from "@/firebase/clientApp";
import { UserModel } from "@/models/User";
import FileUtils from "@/utils/FileUtils";
import { triGram } from "@/utils/StringUtils";
import { updateProfile, User } from "firebase/auth";
import { v4 } from "uuid";
import {
    collection,
    collectionGroup,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    where,
    WriteBatch,
    writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

class UserService {
    static getAll = async () => {
        const userDocsRef = collection(
            fireStore,
            firebaseRoute.getAllUserRoute()
        );
        const userDocs = await getDocs(userDocsRef);
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
                trigramName,
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
            batch.update(userDocRef, {
                displayName: profileForm.displayName,
                photoURL: downloadUrl,
                subBio: profileForm.subBio,
                bio: profileForm.bio,
                imageRef: downloadRef,
            });
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
}

export default UserService;
