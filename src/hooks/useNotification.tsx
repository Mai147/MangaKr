import { NotificationContext } from "@/context/NotificationContext";
import { useContext } from "react";

const useNotification = () => {
    return useContext(NotificationContext);
};

export default useNotification;
