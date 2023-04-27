export const ADMIN_ROLE = "ADMIN";
export const USER_ROLE = "USER";
export const WRITER_ROLE = "WRITER";
export const COMMUNITY_SUPER_ADMIN_ROLE = "COMMUNITY_SUPER_ADMIN";
export const COMMUNITY_ADMIN_ROLE = "COMMUNITY_ADMIN";
export const COMMUNITY_MODERATOR_ROLE = "COMMUNITY_MODERATOR";
export const COMMUNITY_USER_ROLE = "COMMUNITY_USER";
export type CommunityRole =
    | "COMMUNITY_ADMIN"
    | "COMMUNITY_MODERATOR"
    | "COMMUNITY_USER"
    | "COMMUNITY_SUPER_ADMIN";
export type Role = "ADMIN" | "USER" | "WRITER";
export const listCommunityRole = [
    {
        value: "COMMUNITY_USER",
        label: "Thành viên",
    },
    {
        value: "COMMUNITY_MODERATOR",
        label: "Cộng tác viên",
    },
    {
        value: "COMMUNITY_ADMIN",
        label: "Admin",
    },
    {
        value: "COMMUNITY_SUPER_ADMIN",
        label: "SuperAdmin",
    },
];
export const listRole = [
    {
        value: "USER",
        label: "Thành viên",
    },
    {
        value: "WRITER",
        label: "Người viết bài",
    },
    {
        value: "ADMIN",
        label: "Admin",
    },
];
export type CommunityRequestedRole = {
    publicRequestedRole: {
        roles: CommunityRole[];
        isAuthenticated: boolean;
    };
    restrictedRequestedRole: {
        roles: CommunityRole[];
        isAuthenticated: boolean;
    };
    privateRequestedRole: {
        roles: CommunityRole[];
        isAuthenticated: boolean;
    };
};
