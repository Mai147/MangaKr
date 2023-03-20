import { Timestamp } from "firebase/firestore";

export interface Comment {
    id?: string;
    creatorId: string;
    creatorDisplayName: string;
    creatorImageUrl: string | null;
    text: string;
    createdAt: Timestamp;
}

// export interface BookComment extends Comment {
//     bookId: string;
// }
