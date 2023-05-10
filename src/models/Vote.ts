import { Timestamp } from "firebase/firestore";
import { IconType } from "react-icons";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { FaLaughSquint, FaAngry } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { UserSnippet } from "./User";

export interface Vote {
    value: "like" | "dislike";
    field: "numberOfLikes" | "numberOfDislikes";
    icon: IconType;
    color: string;
}

export interface PostVote {
    value: "like" | "favorite" | "laugh" | "dislike" | "angry";
    field:
        | "numberOfLikes"
        | "numberOfDislikes"
        | "numberOfFavorites"
        | "numberOfLaughs"
        | "numberOfAngrys";
    icon: IconType;
    color: string;
}

export const postVoteList: PostVote[] = [
    {
        value: "like",
        field: "numberOfLikes",
        icon: AiFillLike,
        color: "secondary.400",
    },
    {
        value: "favorite",
        field: "numberOfFavorites",
        icon: MdFavorite,
        color: "brand.100",
    },
    {
        value: "laugh",
        field: "numberOfLaughs",
        icon: FaLaughSquint,
        color: "yellow.400",
    },
    {
        value: "dislike",
        field: "numberOfDislikes",
        icon: AiFillDislike,
        color: "gray.700",
    },
    {
        value: "angry",
        field: "numberOfAngrys",
        icon: FaAngry,
        color: "red.500",
    },
];

export const basicVoteList: Vote[] = [
    {
        value: "like",
        field: "numberOfLikes",
        icon: AiFillLike,
        color: "secondary.400",
    },
    {
        value: "dislike",
        field: "numberOfDislikes",
        icon: AiFillDislike,
        color: "gray.700",
    },
];

export interface VotingOption {
    id?: string;
    value?: string;
    imageUrl?: string;
    imageRef?: string;
    numberOfVotes: number;
}

export interface Voting {
    id?: string;
    communityId: string;
    content: string;
    options: VotingOption[];
    creatorId: string;
    creatorDisplayName: string;
    creatorImageUrl?: string;
    numberOfOptions: number;
    numberOfVotes: number;
    isClose: boolean;
    isAccept: boolean;
    isLock: boolean;
    timeLast: Timestamp;
    votingVoteSnippets: UserSnippet[];
    createdAt?: Timestamp;
}

export const defaultVotingForm: Voting = {
    content: "",
    communityId: "",
    options: [],
    creatorId: "",
    creatorDisplayName: "",
    numberOfOptions: 0,
    numberOfVotes: 0,
    isAccept: false,
    isClose: false,
    isLock: false,
    votingVoteSnippets: [],
    timeLast: Timestamp.fromDate(new Date()),
};

export const defaultVotingOption: VotingOption = {
    numberOfVotes: 0,
    value: "",
};
