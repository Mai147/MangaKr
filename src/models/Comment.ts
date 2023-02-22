import { Timestamp } from "firebase/firestore";

interface Comment {
    id?: string;
    creatorId: string;
    creatorDisplayName: string;
    creatorImageUrl: string | null;
    text: string;
    createdAt: Timestamp;
}

export interface BookComment extends Comment {
    bookId: string;
}
