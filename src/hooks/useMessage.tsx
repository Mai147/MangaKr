import { MessageContext } from "@/context/MessageContext";
import { useContext } from "react";

export const useMessage = () => {
    return useContext(MessageContext);
};
