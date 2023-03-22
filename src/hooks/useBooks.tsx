import { BookContext } from "@/context/BookContext";
import { useContext } from "react";

const useBooks = () => {
    return useContext(BookContext);
};

export default useBooks;
