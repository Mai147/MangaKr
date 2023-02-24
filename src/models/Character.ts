export interface Character {
    id?: string;
    name: string;
    bookId: string;
    imageUrl?: string;
    role?: string;
    bio?: string;
    numberOfLikes: number;
    numberOfDislikes: number;
}

export type CharacterVote = {
    id: string;
    characterId: string;
    value: number;
};
