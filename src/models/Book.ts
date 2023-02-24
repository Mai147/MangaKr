import { Timestamp } from "firebase/firestore";
import { Author } from "./Author";
import { Character } from "./Character";
import { Genre, GenreSnippet } from "./Genre";

export type BookStatus = "DONE" | "GOING" | "DROP";

export interface Book {
    id?: string;
    name: string;
    imageUrl?: string;
    description?: string;
    authorIds?: string[];
    genreIds?: string[];
    genreSnippets: GenreSnippet[];
    plot?: string;
    characters?: string;
    status?: string;
    volumes?: string;
    chapters?: string;
    characterSnippets?: Character[];
    publishedDate?: Timestamp;
    rating: number;
    popularity: number;
    numberOfRates: number;
    numberOfComments: number;
    numberOfReviews: number;
    writerId: string;
    createdAt?: Timestamp;
    authors?: Author[];
}

export type BookVote = {
    bookId: string;
    value: number;
};
