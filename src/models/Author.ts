export interface Author {
    id?: string;
    name: string;
    imageUrl?: string;
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
