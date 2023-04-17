export const EVERYONE_PRIVACY = "EVERYONE_PRIVACY";
export const FOLLOW_PRIVACY = "FOLLOW_PRIVACY";
export const ONLYME_PRIVACY = "ONLYME_PRIVACY";

export type PrivacyType =
    | "EVERYONE_PRIVACY"
    | "FOLLOW_PRIVACY"
    | "ONLYME_PRIVACY";

export const privacyList = [
    {
        value: EVERYONE_PRIVACY,
        title: "Mọi người",
        content: "(Bất kì ai đều có thể xem bài viết của bạn)",
    },
    {
        value: FOLLOW_PRIVACY,
        title: "Bạn bè",
        content: "(Chỉ người theo dõi có thể xem bài viết của bạn)",
    },
    {
        value: ONLYME_PRIVACY,
        title: "Chỉ mình tôi",
        content: "(Chỉ bạn có thể xem bài viết của bạn)",
    },
];
