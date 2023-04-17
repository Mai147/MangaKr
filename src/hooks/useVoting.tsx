import { VotingContext } from "@/context/VotingContext";
import { useContext } from "react";

const useVoting = () => {
    return useContext(VotingContext);
};

export default useVoting;
