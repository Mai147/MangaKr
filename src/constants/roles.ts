export const ADMIN_ROLE = "ADMIN";
export const USER_ROLE = "USER";
export const WRITER_ROLE = "WRITER";
export const COMMUNITY_ADMIN_ROLE = "COMMUNITY_ADMIN";
export const COMMUNITY_MODERATOR_ROLE = "COMMUNITY_MODERATOR";
export const COMMUNITY_USER_ROLE = "COMMUNITY_USER";
export type CommunityRole =
    | "COMMUNITY_ADMIN"
    | "COMMUNITY_MODERATOR"
    | "COMMUNITY_USER";
export type CommunityRequestedRole = {
    publicRequestedRole: CommunityRole[];
    restrictedRequestedRole: CommunityRole[];
    privateRequestedRole: CommunityRole[];
};
