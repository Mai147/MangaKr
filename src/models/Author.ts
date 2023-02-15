export interface AuthorSnippet {
    id: string;
    name: string;
    imageUrl?: string;
}

export interface Author extends AuthorSnippet {
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
