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
}

export interface CommunityPost extends Post {
    communityId: string;
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
};
