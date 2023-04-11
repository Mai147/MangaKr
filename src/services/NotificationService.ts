import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { Notification } from "@/models/Notification";
import {
    collection,
    getDocs,
    query,
    runTransaction,
    where,
    writeBatch,
} from "firebase/firestore";

class NotificationService {
    static getAll = async ({ userId }: { userId: string }) => {
        const notificationDocsRef = collection(
            fireStore,
            firebaseRoute.getUserNotificationRoute(userId)
        );
        const notificationDocs = await getDocs(notificationDocsRef);
        const notifications = notificationDocs.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as Notification)
        );
        return notifications;
    };
    static create = async ({}: {}) => {};
    static updateOrCreate = async ({}: {}) => {};
    static seenIfRead = async ({ userId }: { userId: string }) => {
        try {
            const batch = writeBatch(fireStore);
            const notificationDocsRef = collection(
                fireStore,
                firebaseRoute.getUserNotificationRoute(userId)
            );
            const notificationQuery = query(
                notificationDocsRef,
                where("isRead", "==", true),
                where("isSeen", "==", false)
            );
            const notificationDocs = await getDocs(notificationQuery);
            notificationDocs.docs.forEach((doc) => {
                batch.update(doc.ref, {
                    isSeen: true,
                });
            });
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };
}

export default NotificationService;
