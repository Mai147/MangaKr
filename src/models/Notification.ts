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
    // TODO:
    type:
        | "FOLLOW_REQUEST" //DONE
        | "FOLLOW_ACCEPT" //DONE
        | "FOLLOWED_POST" //DONE
        | "COMMUNITY_APPROVE" //DONE
        | "COMMUNITY_POST"; //DONE;
}

export const defaultNotification: Notification = {
    content: "",
    isSeen: false,
    isRead: false,
    type: "FOLLOW_REQUEST",
};
