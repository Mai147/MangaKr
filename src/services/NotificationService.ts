import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { Notification } from "@/models/Notification";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    runTransaction,
    Transaction,
    where,
    writeBatch,
} from "firebase/firestore";

class NotificationService {
    static getAll = async ({ userId }: { userId: string }) => {
        const notificationDocsRef = collection(
            fireStore,
            firebaseRoute.getUserNotificationRoute(userId)
        );
        const notificationQuery = query(
            notificationDocsRef,
            orderBy("createdAt", "desc")
        );
        const notificationDocs = await getDocs(notificationQuery);
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
    static updateOrCreate = async ({
        notification,
        userId,
        transaction,
    }: {
        notification: Notification;
        userId: string;
        transaction?: Transaction;
    }) => {
        try {
            const userNotificationDocRef = doc(
                fireStore,
                firebaseRoute.getUserNotificationRoute(userId),
                notification.id!
            );
            if (transaction) {
                const userNotificationDoc = await transaction.get(
                    userNotificationDocRef
                );
                if (!userNotificationDoc.exists()) {
                    transaction.set(userNotificationDocRef, notification);
                } else {
                    transaction.update(userNotificationDocRef, {
                        ...notification,
                    });
                }
            } else {
                await runTransaction(fireStore, async (transaction) => {
                    const userNotificationDoc = await transaction.get(
                        userNotificationDocRef
                    );
                    if (!userNotificationDoc.exists()) {
                        transaction.set(userNotificationDocRef, notification);
                    } else {
                        transaction.update(userNotificationDocRef, {
                            ...notification,
                        });
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    static delete = async ({
        notificationId,
        userId,
        transaction,
    }: {
        userId: string;
        notificationId: string;
        transaction?: Transaction;
    }) => {
        try {
            const userNotificationDocRef = doc(
                fireStore,
                firebaseRoute.getUserNotificationRoute(userId),
                notificationId
            );
            if (transaction) {
                transaction.delete(userNotificationDocRef);
            } else {
                await runTransaction(fireStore, async (transaction) => {
                    transaction.delete(userNotificationDocRef);
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
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
    static seen = async ({
        userId,
        notificationId,
    }: {
        userId: string;
        notificationId: string;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            const notificationDocRef = doc(
                fireStore,
                firebaseRoute.getUserNotificationRoute(userId),
                notificationId
            );
            const notificationDoc = await getDoc(notificationDocRef);
            if (notificationDoc.exists()) {
                batch.update(notificationDocRef, {
                    isSeen: true,
                });
            }
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };
}

export default NotificationService;
