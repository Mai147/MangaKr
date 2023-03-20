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
    creatorId: string;
    numberOfMembers: number;
    privacyType: CommunityType;
    createdAt?: Timestamp;
    imageUrl?: string;
}
