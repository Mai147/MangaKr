import { User } from "firebase/auth";
import { Book, BookSnippet } from "./Book";

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
