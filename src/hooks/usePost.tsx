import { PostContext } from "@/context/PostContext";
import { useContext } from "react";

const usePost = () => {
    return useContext(PostContext);
};

export default usePost;
