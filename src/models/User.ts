import { User } from "firebase/auth";
import { BookSnippet, BookVote } from "./Book";

export interface UserModel extends User {
    role: string;
    bio?: string;
    subBio?: string;
    // TODO: snippet
    readingBookSnippet?: BookSnippet[];
    writingBookSnippet?: BookSnippet[];
}
