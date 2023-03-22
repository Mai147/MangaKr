import { Timestamp } from "firebase/firestore";
import { AuthorSnippet } from "./Author";
import { CharacterSnippet } from "./Character";
import { GenreSnippet } from "./Genre";

export type BookStatus = "DONE" | "GOING" | "DROP";

export const bookStatusList = [
    {
        label: "Hoàn thành",
        value: "DONE",
    },
    {
        label: "Còn tiếp",
        value: "GOING",
    },
    {
        label: "Đang tạm dừng",
        value: "DROP",
    },
];

export interface BookSnippet {
    id?: string;
    name: string;
    imageUrl?: string;
    description?: string;
    authorIds?: string[];
    genreIds?: string[];
    characterIds?: string[];
}

export interface Book extends BookSnippet {
    authorSnippets: AuthorSnippet[];
    genreSnippets: GenreSnippet[];
    plot?: string;
    characters?: string;
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

export interface ReadingBookSnippet extends BookSnippet {
    status: BookStatus;
    chap: string;
}

export type BookVote = {
    bookId: string;
    value: number;
};

export const defaultBookForm: Book = {
    name: "",
    description: "",
    chapters: "",
    characters: "",
    authorIds: [],
    genreIds: [],
    genreSnippets: [],
    authorSnippets: [],
    characterIds: [],
    characterSnippets: [],
    plot: "",
    publishedDate: undefined,
    status: "",
    volumes: "",
    rating: 0,
    popularity: 0,
    numberOfRates: 0,
    numberOfComments: 0,
    numberOfReviews: 0,
    writerId: "1",
};
