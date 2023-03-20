import { BookCreateContext } from "@/context/BookCreateContext";
import { useContext } from "react";

const useBookCreate = () => {
    return useContext(BookCreateContext);
};

export default useBookCreate;
