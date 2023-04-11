import { Timestamp } from "firebase/firestore";

export interface Message {
    id?: string;
    latestContent?: string;
    latestContentId?: string;
    contents?: MessageContent[];
    imageUrls: string[];
    imageRefs: string[];
    type: "RECEIVE" | "SEND";
    createdAt?: Timestamp;
}

export interface MessageContent {
    id: string;
    content: string;
    isSent: boolean;
}

export const defaultMessageForm: Message = {
    contents: [],
    type: "SEND",
    imageUrls: [],
    imageRefs: [],
};
