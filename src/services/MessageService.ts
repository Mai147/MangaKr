import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { Message } from "@/models/Message";
import { UserMessageSnippet } from "@/models/User";
import FileUtils from "@/utils/FileUtils";
import MessageUtils from "@/utils/MessageUtils";
import { isToday } from "@/utils/StringUtils";
import {
    arrayUnion,
    collection,
    doc,
    DocumentData,
    DocumentReference,
    getDoc,
    getDocs,
    increment,
    orderBy,
    query,
    runTransaction,
    serverTimestamp,
    Timestamp,
    updateDoc,
    writeBatch,
} from "firebase/firestore";

class MessageService {
    static getAll = async ({
        receiverId,
        userId,
    }: {
        userId: string;
        receiverId: string;
    }) => {
        const userMessageDetailDocsRef = collection(
            fireStore,
            firebaseRoute.getUserMessageDetailRoute(userId, receiverId)
        );
        const userMessageDetailQuery = query(
            userMessageDetailDocsRef,
            orderBy("createdAt", "asc")
        );
        const userMessageDetailDocs = await getDocs(userMessageDetailQuery);
        return MessageUtils.fromDocs(userMessageDetailDocs.docs);
    };
    static get = async ({
        messageId,
        receiverId,
        userId,
    }: {
        userId: string;
        receiverId: string;
        messageId: string;
    }) => {
        const messageDocRef = doc(
            fireStore,
            firebaseRoute.getUserMessageDetailRoute(userId, receiverId),
            messageId
        );
        const messageDoc = await getDoc(messageDocRef);
        if (messageDoc.exists()) {
            return MessageUtils.fromDoc(messageDoc);
        }
    };
    static create = async ({
        messageForm,
        receiverDisplayName,
        receiverId,
        senderId,
        senderDisplayName,
        senderImageUrl,
        receiverImageUrl,
    }: {
        senderId: string;
        senderDisplayName: string;
        senderImageUrl?: string | null;
        receiverId: string;
        receiverDisplayName: string;
        receiverImageUrl?: string | null;
        messageForm: Message;
    }) => {
        try {
            await runTransaction(fireStore, async (transaction) => {
                let senderIsSameFromLatest = false;
                let receiverIsSameFromLatest = false;
                let senderLatestMessageId = "";
                let receiverLatestMessageId = "";
                const senderMessageDocRef = doc(
                    fireStore,
                    firebaseRoute.getUserMessageRoute(senderId),
                    receiverId
                );
                const receiverMessageDocRef = doc(
                    fireStore,
                    firebaseRoute.getUserMessageRoute(receiverId),
                    senderId
                );
                const senderMessageDoc = await transaction.get(
                    senderMessageDocRef
                );
                const receiverMessageDoc = await transaction.get(
                    receiverMessageDocRef
                );
                const senderMessageDetailDocsRef = collection(
                    fireStore,
                    firebaseRoute.getUserMessageDetailRoute(
                        senderId,
                        receiverId
                    )
                );
                const receiverMessageDetailDocsRef = collection(
                    fireStore,
                    firebaseRoute.getUserMessageDetailRoute(
                        receiverId,
                        senderId
                    )
                );
                const newMessageDocRef = doc(senderMessageDetailDocsRef);
                const senderLatestContent = messageForm.latestContent
                    ? `Bạn: ${messageForm.latestContent}`
                    : "";
                const receiverLatestContent = messageForm.latestContent
                    ? `${senderDisplayName} ${messageForm.latestContent}`
                    : "";
                // const senderLatestContent = messageForm.latestContent
                //     ? `Bạn: ${messageForm.latestContent}`
                //     : messageForm.imageUrls.length > 0
                //     ? `Bạn đã gửi 1 hình ảnh`
                //     : "";
                // const receiverLatestContent = messageForm.latestContent
                //     ? messageForm.latestContent
                //     : messageForm.imageUrls.length > 0
                //     ? `${senderDisplayName} đã gửi 1 hình ảnh`
                //     : "";
                if (!senderMessageDoc.exists()) {
                    const userMessage: UserMessageSnippet = {
                        id: receiverId,
                        messageId: newMessageDocRef.id,
                        displayName: receiverDisplayName,
                        imageUrl: receiverImageUrl,
                        latestMessage: senderLatestContent,
                        numberOfUnseens: 0,
                        latestCreatedAt: serverTimestamp() as Timestamp,
                        type: "SEND",
                    };
                    transaction.set(senderMessageDocRef, userMessage);
                } else {
                    transaction.update(senderMessageDocRef, {
                        latestMessage: senderLatestContent,
                        numberOfUnseens: 0,
                        latestCreatedAt: serverTimestamp() as Timestamp,
                        type: "SEND",
                    });
                    const { type, messageId, latestCreatedAt } =
                        senderMessageDoc.data();
                    if (
                        type === "SEND" &&
                        messageForm.imageUrls.length <= 0 &&
                        isToday(latestCreatedAt as Timestamp)
                    ) {
                        senderIsSameFromLatest = true;
                        senderLatestMessageId = messageId;
                    } else {
                        transaction.update(senderMessageDocRef, {
                            messageId: newMessageDocRef.id,
                        });
                    }
                }
                if (!receiverMessageDoc.exists()) {
                    const userMessage: UserMessageSnippet = {
                        id: senderId,
                        messageId: newMessageDocRef.id,
                        displayName: senderDisplayName,
                        imageUrl: senderImageUrl,
                        latestMessage: receiverLatestContent,
                        numberOfUnseens: 1,
                        latestCreatedAt: serverTimestamp() as Timestamp,
                        type: "RECEIVE",
                    };
                    transaction.set(receiverMessageDocRef, userMessage);
                } else {
                    transaction.update(receiverMessageDocRef, {
                        latestMessage: receiverLatestContent,
                        numberOfUnseens: increment(1),
                        latestCreatedAt: serverTimestamp() as Timestamp,
                        type: "RECEIVE",
                    });
                    const { type, messageId, latestCreatedAt } =
                        receiverMessageDoc.data();
                    if (
                        type === "RECEIVE" &&
                        messageForm.imageUrls.length <= 0 &&
                        isToday(latestCreatedAt as Timestamp)
                    ) {
                        receiverIsSameFromLatest = true;
                        receiverLatestMessageId = messageId;
                    } else {
                        transaction.update(receiverMessageDocRef, {
                            messageId: newMessageDocRef.id,
                        });
                    }
                }
                let senderMessageDetailDocRef;
                let receiverMessageDetailDocRef;
                if (senderIsSameFromLatest) {
                    senderMessageDetailDocRef = doc(
                        senderMessageDetailDocsRef,
                        senderLatestMessageId
                    );
                    transaction.update(senderMessageDetailDocRef, {
                        contents: arrayUnion(messageForm.latestContent),
                        createdAt: serverTimestamp() as Timestamp,
                    });
                } else {
                    senderMessageDetailDocRef = newMessageDocRef;
                    transaction.set(senderMessageDetailDocRef, {
                        ...messageForm,
                        id: senderMessageDetailDocRef.id,
                        type: "SEND",
                        contents: [messageForm.latestContent],
                        createdAt: serverTimestamp() as Timestamp,
                    });
                }
                if (receiverIsSameFromLatest) {
                    receiverMessageDetailDocRef = doc(
                        receiverMessageDetailDocsRef,
                        receiverLatestMessageId
                    );
                    transaction.update(receiverMessageDetailDocRef, {
                        contents: arrayUnion(messageForm.latestContent),
                        createdAt: serverTimestamp() as Timestamp,
                    });
                } else {
                    receiverMessageDetailDocRef = doc(
                        receiverMessageDetailDocsRef,
                        newMessageDocRef.id
                    );
                    transaction.set(receiverMessageDetailDocRef, {
                        ...messageForm,
                        id: senderMessageDetailDocRef.id,
                        type: "RECEIVE",
                        contents: [messageForm.latestContent],
                        createdAt: serverTimestamp() as Timestamp,
                    });
                }
                const messageImageUrls = await FileUtils.uploadMulitpleFile({
                    imagesRoute: firebaseRoute.getMessageImageRoute(
                        senderMessageDetailDocsRef.id
                    ),
                    imageUrls: messageForm.imageUrls,
                });
                if (messageImageUrls) {
                    transaction.update(senderMessageDetailDocRef, {
                        imageUrls: messageImageUrls,
                    });
                    transaction.update(receiverMessageDetailDocRef, {
                        imageUrls: messageImageUrls,
                    });
                }
            });
            return {
                ...messageForm,
                createdAt: Timestamp.fromDate(new Date()),
            } as Message;
        } catch (error) {
            console.log(error);
        }
    };
    static seen = async ({
        receiverId,
        userId,
    }: {
        userId: string;
        receiverId: string;
    }) => {
        try {
            const userMessageDocRef = doc(
                fireStore,
                firebaseRoute.getUserMessageRoute(userId),
                receiverId
            );
            const userMessageDoc = await getDoc(userMessageDocRef);
            if (userMessageDoc.exists()) {
                await updateDoc(userMessageDocRef, {
                    numberOfUnseens: 0,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
}

export default MessageService;
