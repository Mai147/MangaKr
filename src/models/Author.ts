export interface AuthorSnippet {
    id?: string;
    name: string;
    imageUrl?: string;
}

export interface Author extends AuthorSnippet {
    creatorId: string;
    bio?: string;
    numberOfBooks: number;
    numberOfLikes: number;
    numberOfDislikes: number;
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
    numberOfBooks: 0,
    numberOfDislikes: 0,
    numberOfLikes: 0,
};
