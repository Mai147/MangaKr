import { HomeContext } from "@/context/HomeContext";
import { useContext } from "react";

const useHome = () => {
    return useContext(HomeContext);
};

export default useHome;
