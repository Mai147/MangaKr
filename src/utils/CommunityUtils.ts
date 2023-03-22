import { firebaseRoute } from "@/constants/firebaseRoutes";
import { CommunityRequestedRole, CommunityRole } from "@/constants/roles";
import { fireStore } from "@/firebase/clientApp";
import { CommunityType } from "@/models/Community";
import { UserCommunitySnippet } from "@/models/User";
import { doc, getDoc } from "firebase/firestore";

let CommunityUtils = {};

const checkCommunityTypeAuthorization = (
    communityRequestedRole: CommunityRole[],
    userRole?: CommunityRole
) => {
    if (communityRequestedRole.length === 0) return true;
    if (!userRole) return false;
    if (communityRequestedRole.includes(userRole)) return true;
    return false;
};

const checkAuthorization = (
    requestedRole: CommunityRequestedRole,
    communityType: CommunityType,
    userRole?: CommunityRole
) => {
    const {
        publicRequestedRole,
        restrictedRequestedRole,
        privateRequestedRole,
    } = requestedRole;
    switch (communityType) {
        case "public":
            if (checkCommunityTypeAuthorization(publicRequestedRole, userRole))
                return true;
            break;
        case "restricted":
            if (
                checkCommunityTypeAuthorization(
                    restrictedRequestedRole,
                    userRole
                )
            )
                return true;
            break;
        case "private":
            if (checkCommunityTypeAuthorization(privateRequestedRole, userRole))
                return true;
            break;
    }
    return false;
};

const canCreatePosts = (
    communityType: CommunityType,
    userRole?: CommunityRole
) => {
    return checkAuthorization(
        {
            publicRequestedRole: [],
            privateRequestedRole: ["COMMUNITY_MODERATOR", "COMMUNITY_ADMIN"],
            restrictedRequestedRole: ["COMMUNITY_MODERATOR", "COMMUNITY_ADMIN"],
        },
        communityType,
        userRole
    );
};

const getUserCommunityRole = async (communityId: string, userId: string) => {
    const userCommunityDocRef = doc(
        fireStore,
        firebaseRoute.getUserCommunitySnippetRoute(userId),
        communityId
    );
    const userCommunityDoc = await getDoc(userCommunityDocRef);
    if (userCommunityDoc.exists()) {
        return (userCommunityDoc.data() as UserCommunitySnippet).role;
    }
};

export default CommunityUtils = {
    canCreatePosts,
    getUserCommunityRole,
};
