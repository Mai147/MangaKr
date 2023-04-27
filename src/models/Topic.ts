import { Timestamp } from "firebase/firestore";

export interface Topic {
    id?: string;
    title: string;
    description?: string;
    imageUrl?: string;
    imageRef?: string;
    communityId: string;
    numberOfReplies: number;
    creatorId: string;
    creatorDisplayName: string;
    creatorImageUrl?: string;
    createdAt?: Timestamp;
    isAccept: boolean;
    isClose: boolean;
    isLock?: boolean;
}

export interface TopicReply {
    id?: string;
    topicId: string;
    replyText: string;
    creatorId: string;
    creatorDisplayName: string;
    creatorImageUrl?: string;
    createdAt?: Timestamp;
}

export const defaultTopicForm: Topic = {
    title: "",
    description: "",
    communityId: "",
    imageUrl: "",
    creatorId: "",
    creatorDisplayName: "",
    creatorImageUrl: "",
    numberOfReplies: 0,
    isAccept: false,
    isClose: false,
    isLock: false,
};

export const defaultTopicReplyForm: TopicReply = {
    topicId: "",
    replyText: "",
    creatorId: "",
    creatorDisplayName: "",
};
