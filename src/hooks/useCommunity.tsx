import { CommunityContext } from "@/context/CommunityContext";
import { useContext } from "react";

const useCommunity = () => {
    return useContext(CommunityContext);
};

export default useCommunity;
