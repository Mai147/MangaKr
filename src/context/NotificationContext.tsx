import useAuth from "@/hooks/useAuth";
import { Notification } from "@/models/Notification";
import NotificationService from "@/services/NotificationService";
import { createContext, useEffect, useRef, useState } from "react";

type NotificationState = {
    list: Notification[];
    isNotSeenList: Notification[];
};

type NotificationAction = {
    read: () => Promise<void>;
    seen: (userId: string, notificationId: string) => Promise<void>;
    clear: (notificationId: string) => void;
};

type NotificationContextState = {
    notificationState: NotificationState;
    notificationAction: NotificationAction;
};

const defaultNotificationState: NotificationState = {
    list: [],
    isNotSeenList: [],
};

const defaultNotificationAction: NotificationAction = {
    read: async () => {},
    seen: async () => {},
    clear: async () => {},
};

const defaultNotificationContextState: NotificationContextState = {
    notificationState: defaultNotificationState,
    notificationAction: defaultNotificationAction,
};

export const NotificationContext = createContext<NotificationContextState>(
    defaultNotificationContextState
);

export const NotificationProvider = ({ children }: any) => {
    const { user } = useAuth();
    const [notificationState, setNotificationState] =
        useState<NotificationState>(defaultNotificationState);
    const isFirstReadNotification = useRef(true);

    const getListNotification = async (userId: string) => {
        const res = await NotificationService.getAll({ userId });
        if (res) {
            setNotificationState((prev) => ({
                ...prev,
                list: res,
            }));
        }
    };

    const readNotification = async () => {
        if (isFirstReadNotification.current && user) {
            await NotificationService.seenIfRead({ userId: user.uid });
        } else {
            isFirstReadNotification.current = false;
        }
    };

    const seenNotification = async (userId: string, notificationId: string) => {
        try {
            await NotificationService.seen({ notificationId, userId });
            setNotificationState((prev) => ({
                ...prev,
                list: prev.list.map((item) =>
                    item.id !== notificationId
                        ? item
                        : {
                              ...item,
                              isSeen: true,
                          }
                ),
            }));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user) {
            isFirstReadNotification.current = true;
            getListNotification(user.uid);
        }
    }, [user]);

    useEffect(() => {
        setNotificationState((prev) => ({
            ...prev,
            isNotSeenList: notificationState.list.filter(
                (noti) => noti.isSeen === false
            ),
        }));
    }, [notificationState.list]);

    return (
        <NotificationContext.Provider
            value={{
                notificationState,
                notificationAction: {
                    read: readNotification,
                    seen: seenNotification,
                    clear: (notificationId) => {
                        setNotificationState((prev) => ({
                            ...prev,
                            list: prev.list.filter(
                                (item) => item.id !== notificationId
                            ),
                        }));
                    },
                },
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
