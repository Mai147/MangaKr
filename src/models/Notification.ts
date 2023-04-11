import { Timestamp } from "firebase/firestore";

export interface Notification {
    id?: string;
    creatorDisplayName?: string;
    imageUrl?: string | null;
    content: string;
    targetName?: string;
    isSeen: boolean;
    isRead: boolean;
    createdAt?: Timestamp;
    type:
        | "FOLLOW_REQUEST"
        | "FOLLOW_ACCEPT"
        | "FOLLOWED_POST"
        | "COMMUNITY_APPROVE"
        | "COMMUNITY_POST";
}

export const defaultNotification: Notification = {
    content: "",
    isSeen: false,
    isRead: false,
    type: "FOLLOW_REQUEST",
};
