import { Timestamp } from "firebase/firestore";
import { AuthorSnippet } from "./Author";
import { CharacterSnippet } from "./Character";
import { GenreSnippet } from "./Genre";

export type BookStatus = "DONE" | "GOING" | "DROP";

export interface BookSnippet {
    id?: string;
    name: string;
    imageUrl?: string;
    description?: string;
    authorIds?: [];
    genreIds?: [];
}

export interface ReadingBookSnippet extends BookSnippet {
    status: BookStatus;
    chap?: number;
}

export interface Book extends BookSnippet {
    plot?: string;
    characters?: string;
    authorSnippets?: AuthorSnippet[];
    genreSnippets?: GenreSnippet[];
    status?: string;
    volumes?: string;
    chapters?: string;
    characterSnippets?: CharacterSnippet[];
    publishedDate?: Timestamp;
    rating: number;
    popularity: number;
    numberOfRates: number;
    numberOfComments: number;
    numberOfReviews: number;
    writerId: string;
    createdAt?: Timestamp;
}

export type BookVote = {
    bookId: string;
    value: number;
};
