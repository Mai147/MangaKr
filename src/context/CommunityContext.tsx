import { firebaseRoute } from "@/constants/firebaseRoutes";
import { CommunityRequestedRole, CommunityRole } from "@/constants/roles";
import { fireStore } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import { Community } from "@/models/Community";
import { UserCommunitySnippet } from "@/models/User";
import CommunityUtils from "@/utils/CommunityUtils";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

type CommunityState = {
    selectedCommunity?: Community | null;
    setSelectedCommunity: (community: Community) => void;
    userCommunityRole?: CommunityRole;
};

const defaultCommunityState: CommunityState = {
    setSelectedCommunity: () => {},
};

export const CommunityContext = createContext<CommunityState>(
    defaultCommunityState
);

export const CommunityProvider = ({ children }: any) => {
    const { user } = useAuth();
    const router = useRouter();
    const [communityState, setCommunityState] = useState<CommunityState>(
        defaultCommunityState
    );

    const getCommunity = async (communityId: string) => {
        const communityDocRef = doc(
            fireStore,
            firebaseRoute.getAllCommunityRoute(),
            communityId
        );
        const communityDoc = await getDoc(communityDocRef);
        if (communityDoc.exists()) {
            const moderatorSnippetDocsRef = collection(
                fireStore,
                firebaseRoute.getCommunityModeratorSnippetRoute(communityDoc.id)
            );
            const moderatorSnippetDocs = await getDocs(moderatorSnippetDocsRef);
            const moderatorSnippets = moderatorSnippetDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            const community = {
                id: communityDoc.id,
                ...communityDoc.data(),
                moderators: moderatorSnippets,
            } as Community;
            setCommunityState((prev) => ({
                ...prev,
                selectedCommunity: community,
            }));
        } else {
            setCommunityState((prev) => ({
                ...prev,
                selectedCommunity: null,
            }));
        }
    };

    const getUserCommunityRole = async (
        communityId: string,
        userId: string
    ) => {
        const userCommunityRole = await CommunityUtils.getUserCommunityRole(
            communityId,
            userId
        );
        setCommunityState((prev) => ({
            ...prev,
            userCommunityRole,
        }));
    };

    useEffect(() => {
        if (communityState.selectedCommunity && user) {
            getUserCommunityRole(
                communityState.selectedCommunity.id!,
                user.uid
            );
        }
    }, [communityState.selectedCommunity?.id, user]);

    useEffect(() => {
        const { cid } = router.query;
        if (cid) {
            getCommunity(cid as string);
        } else {
            setCommunityState((prev) => ({
                ...prev,
                selectedCommunity: undefined,
            }));
        }
    }, [router.query]);

    return (
        <CommunityContext.Provider
            value={{
                ...communityState,
                setSelectedCommunity: (community) =>
                    setCommunityState((prev) => ({
                        ...prev,
                        selectedCommunity: community,
                    })),
            }}
        >
            {children}
        </CommunityContext.Provider>
    );
};
