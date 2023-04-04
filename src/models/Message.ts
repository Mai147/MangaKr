import { Timestamp } from "firebase/firestore";

export interface Message {
    id?: string;
    latestContent?: string;
    contents?: string[];
    imageUrls: string[];
    type: "RECEIVE" | "SEND";
    createdAt?: Timestamp;
}

export const defaultMessageForm: Message = {
    contents: [],
    type: "SEND",
    imageUrls: [],
};
