import { Timestamp } from "firebase/firestore";

export interface Comment {
    id?: string;
    creatorId: string;
    creatorDisplayName: string;
    creatorImageUrl: string | null;
    numberOfLikes: number;
    numberOfDislikes: number;
    text: string;
    createdAt: Timestamp;
    replyComments?: Comment[];
    numberOfReplies: number;
}
