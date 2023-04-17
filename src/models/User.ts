import { CommunityRole } from "@/constants/roles";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { Book, BookSnippet } from "./Book";

export interface UserSnippet {
    id: string;
    displayName: string;
    imageUrl?: string | null;
}

export interface UserModel extends User {
    imageRef?: string;
    role: string;
    bio?: string;
    numberOfPosts: number;
    numberOfFollows: number;
    numberOfFolloweds: number;
    readingBookSnippets?: BookSnippet[];
    writingBookSnippets?: BookSnippet[];
    readingBooks?: Book[];
}

export interface UserMessageSnippet {
    messageId: string;
    latestContentId?: string;
    id: string;
    displayName: string;
    imageUrl?: string | null;
    latestMessage?: string;
    latestImages?: string[];
    latestCreatedAt?: Timestamp;
    numberOfUnseens: number;
    type: "RECEIVE" | "SEND";
}

export interface UserCommunitySnippet {
    id: string;
    name: string;
    role: CommunityRole;
    isAccept: boolean;
}

export interface CommunityUserSnippet {
    id: string;
    displayName: string;
    imageUrl?: string | null;
    role: CommunityRole;
    isAccept: boolean;
    createdAt?: Timestamp;
}

export interface Follow {
    id?: string;
    displayName: string;
    imageUrl?: string | null;
    isAccept: boolean;
    createdAt?: Timestamp;
}
