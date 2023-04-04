import { CommunityRole } from "@/constants/roles";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { Book, BookSnippet } from "./Book";
import { LatestPost } from "./Post";

export interface UserSnippet {
    id: string;
    displayName: string;
    imageUrl?: string | null;
}

export interface UserModel extends User {
    role: string;
    bio?: string;
    subBio?: string;
    // TODO: snippet
    readingBookSnippets?: BookSnippet[];
    writingBookSnippets?: BookSnippet[];
    readingBooks?: Book[];
}

export interface UserMessageSnippet {
    messageId: string;
    id: string;
    displayName: string;
    imageUrl?: string | null;
    latestMessage?: string;
    latestCreatedAt?: Timestamp;
    numberOfUnseens: number;
    type: "RECEIVE" | "SEND";
}

export interface UserCommunitySnippet {
    id: string;
    name: string;
    role: CommunityRole;
    isAccept: boolean;
    latestPost?: LatestPost;
}

export interface CommunityUserSnippet {
    id: string;
    displayName: string;
    imageUrl?: string | null;
    role: CommunityRole;
    isAccept: boolean;
    createdAt?: Timestamp;
}
