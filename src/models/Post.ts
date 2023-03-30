import { Timestamp } from "firebase/firestore";

export interface Post {
    id?: string;
    imageUrls: string[];
    caption: string;
    description?: string;
    creatorId: string;
    creatorDisplayName: string;
    creatorImageUrl?: string | null;
    createdAt?: Timestamp;
    numberOfLikes: number;
    numberOfDislikes: number;
    numberOfFavorites: number;
    numberOfLaughs: number;
    numberOfAngrys: number;
    numberOfComments: number;
    isAccept: boolean;
}

export interface CommunityPost extends Post {
    communityId: string;
}

export interface LatestPost {
    id: string;
    communityId: string;
    communityName: string;
    creatorId: string;
    creatorDisplayName: string;
    imageUrl?: string;
    createdAt: Timestamp;
}

export interface PostNotification extends LatestPost {
    isReading: boolean;
}

export const defaultPostForm: Post = {
    caption: "",
    description: "",
    creatorId: "",
    creatorDisplayName: "",
    imageUrls: [],
    numberOfAngrys: 0,
    numberOfComments: 0,
    numberOfDislikes: 0,
    numberOfFavorites: 0,
    numberOfLaughs: 0,
    numberOfLikes: 0,
    isAccept: false,
};