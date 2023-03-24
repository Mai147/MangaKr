import { IconType } from "react-icons";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { FaLaughSquint, FaAngry } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";

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
        color: "blue.500",
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
        color: "blue.500",
    },
    {
        value: "dislike",
        field: "numberOfDislikes",
        icon: AiFillDislike,
        color: "gray.700",
    },
];
