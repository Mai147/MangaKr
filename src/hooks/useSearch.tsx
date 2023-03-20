import { SearchContext } from "@/context/SearchContext";
import { useContext } from "react";

const useSearch = () => {
    return useContext(SearchContext);
};

export default useSearch;
