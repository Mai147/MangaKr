import { CommunityRole } from "@/constants/roles";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { Book, BookSnippet } from "./Book";
import { LatestPost } from "./Post";

export interface UserSnippet {
    id: string;
    displayName: string;
    imageUrl?: string;
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

export interface UserCommunitySnippet {
    id: string;
    name: string;
    role: CommunityRole;
    latestPost?: LatestPost;
}
