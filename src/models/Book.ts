import { Timestamp } from "firebase/firestore";
import { AuthorSnippet } from "./Author";
import { CharacterSnippet } from "./Character";
import { GenreSnippet } from "./Genre";

export type BookModel = {
    id: string;
    name: string;
    imageUrl?: string;
    description?: string;
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
    numberOfComments: number;
    numberOfReviews: number;
    writerId: string;
    createdAt: Timestamp;
};

export type BookVote = {
    id: string;
    bookId: string;
    value: number;
};
