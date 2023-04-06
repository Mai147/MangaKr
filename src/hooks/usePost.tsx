import { PostContext } from "@/context/PostContext";
import { useContext } from "react";

export const usePost = () => {
    return useContext(PostContext);
};
