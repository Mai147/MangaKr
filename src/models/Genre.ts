import { Timestamp } from "firebase/firestore";

export interface GenreSnippet {
    id?: string;
    name: string;
}

export interface Genre extends GenreSnippet {
    description: string;
    numberOfBooks: number;
    creatorId: string;
    creatorDisplayName: string;
    createdAt?: Timestamp;
}

export const defaultGenreForm: Genre = {
    name: "",
    description: "",
    numberOfBooks: 0,
    creatorId: "",
    creatorDisplayName: "",
};
