export interface CharacterSnippet {
    id?: string;
    name: string;
    imageUrl?: string;
    imageRef?: string;
    role?: string;
    bio?: string;
}

export interface Character extends CharacterSnippet {
    bookId: string;
    numberOfLikes: number;
    numberOfDislikes: number;
}

export type CharacterVote = {
    id: string;
    characterId: string;
    value: number;
};

export const defaultCharacterForm: Character = {
    bookId: "",
    name: "",
    numberOfDislikes: 0,
    numberOfLikes: 0,
    bio: ``,
    role: "",
};
