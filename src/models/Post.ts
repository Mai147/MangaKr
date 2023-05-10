import { PrivacyType } from "@/constants/privacy";
import { Timestamp } from "firebase/firestore";

export interface Post {
    id?: string;
    imageUrls: string[];
    imageRefs: string[];
    videoUrl?: string;
    videoRef?: string;
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
    numberOfReactions: number;
    numberOfComments: number;
    isAccept: boolean;
    isLock: boolean;
    privacyType: PrivacyType;
}

export interface CommunityPost extends Post {
    communityId: string;
}

export interface SharingPost extends Post {
    sharingUserId: string;
    sharingUserDisplayName: string;
    sharingUserImageUrl?: string | null;
    sharingCreatedAt?: Timestamp;
    url: string;
}

export const defaultPostForm: Post = {
    caption: "",
    description: "",
    creatorId: "",
    creatorDisplayName: "",
    imageUrls: [],
    imageRefs: [],
    numberOfAngrys: 0,
    numberOfComments: 0,
    numberOfDislikes: 0,
    numberOfFavorites: 0,
    numberOfLaughs: 0,
    numberOfLikes: 0,
    numberOfReactions: 0,
    isAccept: false,
    isLock: false,
    privacyType: "EVERYONE_PRIVACY",
};
