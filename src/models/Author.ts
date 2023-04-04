import { Timestamp } from "firebase/firestore";

export interface AuthorSnippet {
    id?: string;
    name: string;
    imageUrl?: string;
}

export interface Author extends AuthorSnippet {
    creatorId: string;
    creatorDisplayName: string;
    bio?: string;
    numberOfBooks: number;
    numberOfLikes: number;
    numberOfDislikes: number;
    createdAt?: Timestamp;
}

export type AuthorVote = {
    id: string;
    authorId: string;
    value: number;
};

export const defaultAuthorForm: Author = {
    name: "",
    bio: "",
    creatorId: "",
    creatorDisplayName: "",
    numberOfBooks: 0,
    numberOfDislikes: 0,
    numberOfLikes: 0,
};
