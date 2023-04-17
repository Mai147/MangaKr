import { routes } from "@/constants/routes";
import { Notification } from "@/models/Notification";

const NotificationUtils = {
    getHref: (notification: Notification) => {
        switch (notification.type) {
            case "FOLLOW_ACCEPT":
                return undefined;
            case "FOLLOW_REQUEST":
                return undefined;
            case "FOLLOWED_POST":
                return routes.getProfilePage(notification.id!);
            case "COMMUNITY_APPROVE":
                return routes.getCommunityDetailPage(notification.id!);
            case "COMMUNITY_POST":
                return routes.getCommunityDetailPage(notification.id!);
        }
    },
};

export default NotificationUtils;
