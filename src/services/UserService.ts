import { ProfileFormState } from "@/components/Profile/Detail";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { USER_ROLE } from "@/constants/roles";
import { fireStore } from "@/firebase/clientApp";
import { UserModel } from "@/models/User";
import FileUtils from "@/utils/FileUtils";
import { updateProfile, User } from "firebase/auth";
import {
    collectionGroup,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    where,
    writeBatch,
} from "firebase/firestore";

class UserService {
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
        await setDoc(
            doc(fireStore, firebaseRoute.getAllUserRoute(), user?.uid),
            {
                ...JSON.parse(JSON.stringify(user)),
                role: USER_ROLE,
                displayName: user.displayName || user.email?.split("@")[0],
            }
        );
    };
    static update = async ({
        profileForm,
        user,
    }: {
        profileForm: ProfileFormState;
        user: User;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            const downloadUrl = await FileUtils.uploadFile({
                imageRoute: firebaseRoute.getUserImageRoute(profileForm.id!),
            });
            await updateProfile(user, {
                displayName: profileForm.displayName,
                photoURL: downloadUrl,
            });
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
            });
            // Update username, image url in comments, reviews
            const reviewDocsRef = collectionGroup(
                fireStore,
                firebaseRoute.getAllReviewRoute()
            );
            const reviewQuery = query(
                reviewDocsRef,
                where("creatorId", "==", profileForm.id)
            );
            const reviewDocs = await getDocs(reviewQuery);
            reviewDocs.docs.forEach((doc) => {
                if (doc.exists()) {
                    batch.update(doc.ref, {
                        creatorDisplayName: profileForm.displayName,
                    });
                }
            });

            const commentDocsRef = collectionGroup(fireStore, "comments");
            const commentQuery = query(
                commentDocsRef,
                where("creatorId", "==", profileForm.id)
            );
            const commentDocs = await getDocs(commentQuery);
            commentDocs.docs.forEach((doc) => {
                if (doc.exists()) {
                    batch.update(doc.ref, {
                        creatorDisplayName: profileForm.displayName,
                        creatorImageUrl: downloadUrl,
                    });
                }
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
}

export default UserService;
