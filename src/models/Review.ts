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

// export interface ReviewSnippet {
// }

export interface Review {
    id?: string;
    bookId: string;
    creatorId: string;
    creatorDisplayName: string;
    title: string;
    imageUrl?: string;
    tagReview: TagReview;
    content: string;
    rating: number;
    numberOfComments: number;
    numberOfLikes: number;
    numberOfDislikes: number;
}
