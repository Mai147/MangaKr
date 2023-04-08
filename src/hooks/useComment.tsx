import { CommentContext } from "@/context/CommentContext";
import { useContext } from "react";

export const useComment = () => {
    return useContext(CommentContext);
};
