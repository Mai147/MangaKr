import { CommunityRole, COMMUNITY_USER_ROLE } from "@/constants/roles";
import { toastOption } from "@/constants/toast";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import { Community } from "@/models/Community";
import { CommunityUserSnippet } from "@/models/User";
import CommunityService from "@/services/CommunityService";
import { validateCreateCommunity } from "@/validation/communityValidation";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

type CommunityState = {
    selectedCommunity?: Community | null;
    selectedCommunityModerators?: CommunityUserSnippet[];
    relatedCommunities?: Community[];
    userCommunityRole?: {
        isAccept: boolean;
        role?: CommunityRole;
    };
    communityLoading: boolean;
};

type CommunityAction = {
    setSelectedCommunity: (community: Community) => void;
    updateCommunityImage: (imageUrl: string) => Promise<void>;
    updateCommunityName: (name: string) => Promise<void>;
    updateCommunityDescription: (description: string) => Promise<void>;
    joinCommunity: () => Promise<void>;
    leaveCommunity: () => Promise<void>;
    toUserRole: () => Promise<void>;
};

type CommunityContextState = {
    communityState: CommunityState;
    communityAction: CommunityAction;
};

const defaultCommunityState: CommunityState = {
    communityLoading: true,
};

const defaultCommunityContextState: CommunityContextState = {
    communityState: {
        ...defaultCommunityState,
    },
    communityAction: {
        setSelectedCommunity: () => {},
        joinCommunity: async () => {},
        leaveCommunity: async () => {},
        toUserRole: async () => {},
        updateCommunityImage: async () => {},
        updateCommunityName: async () => {},
        updateCommunityDescription: async () => {},
    },
};

export const CommunityContext = createContext<CommunityContextState>(
    defaultCommunityContextState
);

export const CommunityProvider = ({ children }: any) => {
    const { toggleView } = useModal();
    const { user } = useAuth();
    const router = useRouter();
    const [communityState, setCommunityState] = useState<CommunityState>(
        defaultCommunityState
    );
    const toast = useToast();

    const getCommunity = async (communityId: string) => {
        const res = await CommunityService.get({ communityId });
        const moderators = await CommunityService.getModerators({
            communityId,
        });
        setCommunityState((prev) => ({
            ...prev,
            selectedCommunity: res ? res : null,
            selectedCommunityModerators: moderators ? moderators : undefined,
        }));
    };

    const getUserCommunityRole = async (
        communityId: string,
        userId: string
    ) => {
        const userCommunityRole = await CommunityService.getUserRole({
            communityId,
            userId,
        });
        setCommunityState((prev) => ({
            ...prev,
            userCommunityRole,
        }));
    };

    const joinCommunity = async () => {
        if (!user) {
            toggleView("login");
            return;
        }
        try {
            if (communityState.selectedCommunity) {
                const res = await CommunityService.join({
                    user,
                    community: communityState.selectedCommunity,
                });
                if (res) {
                    setCommunityState((prev) => ({
                        ...prev,
                        userCommunityRole: res,
                    }));
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const leaveCommunity = async () => {
        if (!user) {
            toggleView("login");
            return;
        }
        try {
            if (communityState.selectedCommunity) {
                await CommunityService.leave({
                    communityId: communityState.selectedCommunity.id!,
                    userId: user.uid,
                    userRole: communityState.userCommunityRole?.role,
                });
                setCommunityState((prev) => ({
                    ...prev,
                    selectedCommunity: {
                        ...prev.selectedCommunity!,
                        numberOfMembers:
                            (prev.selectedCommunity?.numberOfMembers || 1) - 1,
                    },
                    userCommunityRole: undefined,
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const toUserRole = async () => {
        if (user && communityState.selectedCommunity) {
            await CommunityService.changeUserRole({
                communityId: communityState.selectedCommunity.id!,
                newRole: COMMUNITY_USER_ROLE,
                userId: user.uid,
            });
            setCommunityState((prev) => ({
                ...prev,
                userCommunityRole: {
                    ...prev.userCommunityRole!,
                    role: COMMUNITY_USER_ROLE,
                },
            }));
        }
    };

    const updateCommunityImage = async (imageUrl: string) => {
        try {
            const currentCommunity = communityState.selectedCommunity!;
            const res = await CommunityService.update({
                community: currentCommunity,
                communityForm: {
                    ...currentCommunity,
                    imageUrl,
                },
            });
            if (res) {
                setCommunityState((prev) => ({
                    ...prev,
                    selectedCommunity: {
                        ...prev.selectedCommunity!,
                        imageUrl: res.imageUrl,
                    },
                }));
            }
        } catch (error) {
            toast({
                ...toastOption,
                title: "Có lỗi xảy ra! Vui lòng thử lại",
                status: "error",
            });
            console.log(error);
        }
    };

    const updateCommunityName = async (name: string) => {
        try {
            const currentCommunity = communityState.selectedCommunity!;
            const res = await validateCreateCommunity(
                { ...currentCommunity, name },
                currentCommunity.name
            );
            if (!res.result) {
                throw Error("Name exists");
            }
            const updateRes = await CommunityService.update({
                community: currentCommunity,
                communityForm: {
                    ...currentCommunity,
                    name,
                },
            });
            if (updateRes) {
                setCommunityState((prev) => ({
                    ...prev,
                    selectedCommunity: {
                        ...prev.selectedCommunity!,
                        name: updateRes.name,
                    },
                }));
            }
        } catch (error) {
            toast({
                ...toastOption,
                title: "Có lỗi xảy ra! Vui lòng thử lại",
                status: "error",
            });
            console.log(error);
        }
    };

    const updateCommunityDescription = async (description: string) => {
        try {
            const currentCommunity = communityState.selectedCommunity!;
            const updateRes = await CommunityService.update({
                community: currentCommunity,
                communityForm: {
                    ...currentCommunity,
                    description,
                },
            });
            if (updateRes) {
                setCommunityState((prev) => ({
                    ...prev,
                    selectedCommunity: {
                        ...prev.selectedCommunity!,
                        description: updateRes.description,
                    },
                }));
            }
        } catch (error) {
            toast({
                ...toastOption,
                title: "Có lỗi xảy ra! Vui lòng thử lại",
                status: "error",
            });
            console.log(error);
        }
    };

    const getCommunityInfo = async (community: Community, userId?: string) => {
        setCommunityState((prev) => ({
            ...prev,
            communityLoading: true,
        }));
        const res = await CommunityService.getRelated({ community });
        setCommunityState((prev) => ({
            ...prev,
            relatedCommunities: res,
        }));
        if (userId) {
            await getUserCommunityRole(community.id!, userId);
        } else {
            setCommunityState((prev) => ({
                ...prev,
                userCommunityRole: undefined,
            }));
        }
        setCommunityState((prev) => ({
            ...prev,
            communityLoading: false,
        }));
    };

    useEffect(() => {
        const { selectedCommunity } = communityState;
        if (selectedCommunity) {
            getCommunityInfo(selectedCommunity, user?.uid);
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
                communityAction: {
                    setSelectedCommunity: (community) =>
                        setCommunityState((prev) => ({
                            ...prev,
                            selectedCommunity: community,
                        })),
                    updateCommunityImage,
                    updateCommunityName,
                    updateCommunityDescription,
                    joinCommunity,
                    leaveCommunity,
                    toUserRole,
                },
                communityState,
            }}
        >
            {children}
        </CommunityContext.Provider>
    );
};
