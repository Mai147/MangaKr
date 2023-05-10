import { Timestamp } from "firebase/firestore";

export type CommunityType = "public" | "restricted" | "private";

export const communityTypeList = [
    {
        label: "Công khai",
        value: "public",
    },
    {
        label: "Hạn chế",
        value: "restricted",
    },
    {
        label: "Riêng tư",
        value: "private",
    },
];

export interface Community {
    id?: string;
    name: string;
    bookId: string;
    bookName: string;
    description?: string;
    creatorId: string;
    numberOfMembers: number;
    userIds: string[];
    privacyType: CommunityType;
    createdAt?: Timestamp;
    imageUrl?: string;
    imageRef?: string;
    numberOfPosts: number;
    numberOfTopics: number;
    numberOfVotings: number;
}

export const defaultCommunityForm: Community = {
    bookId: "",
    bookName: "",
    name: "",
    creatorId: "",
    numberOfMembers: 1,
    privacyType: "public",
    numberOfPosts: 0,
    numberOfTopics: 0,
    numberOfVotings: 0,
    userIds: [],
};
