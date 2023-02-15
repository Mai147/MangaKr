export interface CharacterSnippet {
    id: string;
    bookId: string;
    name: string;
    imageUrl?: string;
    role?: string;
}

export interface Character extends CharacterSnippet {
    bio?: string;
    numberOfLikes: number;
    numberOfDislikes: number;
}

export type CharacterVote = {
    id: string;
    characterId: string;
    value: number;
};
