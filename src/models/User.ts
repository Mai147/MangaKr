import { User } from "firebase/auth";
import { Book } from "./Book";

export interface UserModel extends User {
    role: string;
    bio?: string;
    subBio?: string;
    // TODO: snippet
    readingBookIds?: string[];
    writingBookIds?: string[];
    readingBooks?: Book[];
    writingBooks?: Book[];
}
