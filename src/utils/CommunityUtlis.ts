import { CommunityRole, CommunityRequestedRole } from "@/constants/roles";
import { Community, CommunityType } from "@/models/Community";
import { UserModel } from "@/models/User";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

let CommunityUtils = {};

const checkCommunityTypeAuthorization = ({
    communityRequestedRole,
    isAuthenticated,
    user,
    userRole,
}: {
    communityRequestedRole: CommunityRole[];
    isAuthenticated: boolean;
    user?: UserModel | null;
    userRole?: CommunityRole;
}) => {
    if (isAuthenticated && !user) return false;
    if (communityRequestedRole.length === 0) return true;
    if (!userRole) return false;
    if (communityRequestedRole.includes(userRole)) return true;
    return false;
};

const checkAuthorization = ({
    communityType,
    requestedRole,
    user,
    userRole,
}: {
    requestedRole: CommunityRequestedRole;
    communityType: CommunityType;
    user?: UserModel | null;
    userRole?: CommunityRole;
}) => {
    const {
        publicRequestedRole,
        restrictedRequestedRole,
        privateRequestedRole,
    } = requestedRole;
    switch (communityType) {
        case "public":
            return checkCommunityTypeAuthorization({
                user,
                userRole,
                communityRequestedRole: publicRequestedRole.roles,
                isAuthenticated: publicRequestedRole.isAuthenticated,
            });
        case "restricted":
            return checkCommunityTypeAuthorization({
                user,
                userRole,
                communityRequestedRole: restrictedRequestedRole.roles,
                isAuthenticated: restrictedRequestedRole.isAuthenticated,
            });
        case "private":
            return checkCommunityTypeAuthorization({
                user,
                userRole,
                communityRequestedRole: privateRequestedRole.roles,
                isAuthenticated: privateRequestedRole.isAuthenticated,
            });
    }
};

const fromDoc = (doc: QueryDocumentSnapshot<DocumentData>) => {
    const community = JSON.parse(JSON.stringify(doc.data())) as Community;
    return {
        id: doc.id,
        ...community,
    } as Community;
};

const fromDocs = (docs: QueryDocumentSnapshot<DocumentData>[]) => {
    return docs.map((doc) => fromDoc(doc));
};

export default CommunityUtils = {
    checkAuthorization,
    fromDoc,
    fromDocs,
};
