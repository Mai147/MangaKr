import { serverTimestamp, Timestamp } from "firebase/firestore";

export type TagReview = "RECOMMENDED" | "NOT RECOMMENDED";

export type TagReviewItem = {
    label: string;
    value: TagReview;
};

export const tagReviewList: TagReviewItem[] = [
    {
        label: "Nên đọc",
        value: "RECOMMENDED",
    },
    {
        label: "Không nên đọc",
        value: "NOT RECOMMENDED",
    },
];

export interface Review {
    id?: string;
    bookId: string;
    bookName: string;
    creatorId: string;
    creatorDisplayName: string;
    title: string;
    imageUrl?: string;
    imageRef?: string;
    tagReview: TagReview;
    content: string;
    rating: number;
    numberOfComments: number;
    numberOfLikes: number;
    numberOfDislikes: number;
    createdAt: Timestamp;
}

export const defaultReviewForm: Review = {
    bookId: "",
    bookName: "",
    content: "",
    creatorId: "",
    creatorDisplayName: "",
    numberOfComments: 0,
    numberOfDislikes: 0,
    numberOfLikes: 0,
    tagReview: "RECOMMENDED",
    title: "",
    rating: 0,
    createdAt: serverTimestamp() as Timestamp,
};
