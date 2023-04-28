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
        | "FOLLOW_REQUEST" //DONE
        | "FOLLOW_ACCEPT" //DONE
        | "FOLLOWED_POST" //DONE
        | "FOLLOWED_SHARE" //DONE
        | "COMMUNITY_APPROVE" //DONE
        | "COMMUNITY_POST" //DONE
        | "POST_LOCK"; // DONE
}

export const defaultNotification: Notification = {
    content: "",
    isSeen: false,
    isRead: false,
    type: "FOLLOW_REQUEST",
};
