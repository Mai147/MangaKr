import { BookContext } from "@/context/BookContext";
import { useContext } from "react";

const useBookCreate = () => {
    return useContext(BookContext);
};

export default useBookCreate;
