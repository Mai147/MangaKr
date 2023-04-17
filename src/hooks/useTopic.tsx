import { TopicContext } from "@/context/TopicContext";
import { useContext } from "react";

const useTopic = () => {
    return useContext(TopicContext);
};

export default useTopic;
