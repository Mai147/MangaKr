import { Timestamp } from "firebase/firestore";
import { AuthorSnippet } from "./Author";
import { CharacterSnippet } from "./Character";
import { GenreSnippet } from "./Genre";

export type FilterValue = "rating" | "popularity" | "numberOfReviews";

type FilterLabel = "Điểm Đánh Giá" | "Số Người Đọc" | "Số Bài Đánh Giá";

export type Filter = {
    label: FilterLabel;
    value: FilterValue;
};

export const filterList: Filter[] = [
    {
        label: "Số Người Đọc",
        value: "popularity",
    },
    {
        label: "Số Bài Đánh Giá",
        value: "numberOfReviews",
    },
    {
        label: "Điểm Đánh Giá",
        value: "rating",
    },
];

export type BookStatus = "DONE" | "GOING" | "DROP";

export const bookStatusList: BookStatusOption[] = [
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

export type BookStatusOption = {
    label: string;
    value: BookStatus;
};

export interface BookSnippet {
    id?: string;
    name: string;
    imageUrl?: string;
    imageRef?: string;
    description?: string;
    authorIds?: string[];
    genreIds?: string[];
    characterIds?: string[];

    writerId: string;
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
    isLock?: boolean;
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
    isLock: false,
    writerId: "",
};

export const defaultReadingBookSnippet: ReadingBookSnippet = {
    chap: "",
    name: "",
    status: "DONE",
    writerId: "",
};
