import { TOPIC_PAGE_COUNT } from "@/constants/pagination";
import { CommunityRole, COMMUNITY_USER_ROLE } from "@/constants/roles";
import { toastOption } from "@/constants/toast";
import useAuth from "@/hooks/useAuth";
import useDebounce from "@/hooks/useDebounce";
import useModal from "@/hooks/useModal";
import usePagination, {
    defaultPaginationInput,
    defaultPaginationOutput,
    PaginationOutput,
    TopicPaginationInput,
} from "@/hooks/usePagination";
import { Community } from "@/models/Community";
import CommunityService from "@/services/CommunityService";
import { validateCreateCommunity } from "@/validation/communityValidation";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

type CommunityState = {
    selectedCommunity?: Community | null;
    relatedCommunities?: Community[];
    topic: {
        input: TopicPaginationInput;
        output: PaginationOutput;
        loading: boolean;
    };
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
    onNextTopic: () => void;
    onPrevTopic: () => void;
    searchTopic: (searchValue: string) => void;
};

type CommunityContextState = {
    communityState: CommunityState;
    communityAction: CommunityAction;
};

const defaultTopicState = {
    input: {
        ...defaultPaginationInput,
        pageCount: TOPIC_PAGE_COUNT,
        isAccept: true,
        communityId: "",
    },
    output: defaultPaginationOutput,
    loading: true,
};

const defaultCommunityState: CommunityState = {
    communityLoading: true,
    topic: defaultTopicState,
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
        onNextTopic: () => {},
        onPrevTopic: () => {},
        searchTopic: () => {},
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
    const debouncedSearch = useDebounce(
        communityState.topic.input.searchValue || "",
        300
    );
    const { getTopics } = usePagination();
    const toast = useToast();

    const getCommunity = async (communityId: string) => {
        const res = await CommunityService.get({ communityId });
        setCommunityState((prev) => ({
            ...prev,
            selectedCommunity: res ? res : null,
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

    const getCommunityTopics = async (communityId: string) => {
        setCommunityState((prev) => ({
            ...prev,
            topic: {
                ...prev.topic,
                loading: true,
            },
        }));
        const input: TopicPaginationInput = {
            ...communityState.topic.input,
            communityId,
            setDocValue: (docValue) => {
                setCommunityState((prev) => ({
                    ...prev,
                    topic: {
                        ...prev.topic,
                        input: {
                            ...prev.topic.input,
                            docValue,
                        },
                    },
                }));
            },
        };
        const res = await getTopics(input);
        if (res) {
            setCommunityState((prev) => ({
                ...prev,
                topic: {
                    ...prev.topic,
                    output: res,
                    input: {
                        ...prev.topic.input,
                        isFirst: false,
                    },
                    loading: false,
                },
            }));
        }
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
            await CommunityService.updateUserLatestPost(userId, community);
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
        setCommunityState((prev) => ({
            ...prev,
            topic: {
                ...defaultTopicState,
                input: {
                    ...defaultTopicState.input,
                    searchValue: prev.topic.input.searchValue,
                },
            },
        }));
    }, [debouncedSearch]);

    useEffect(() => {
        const { selectedCommunity } = communityState;
        if (selectedCommunity) {
            getCommunityInfo(selectedCommunity, user?.uid);
        }
    }, [communityState.selectedCommunity?.id, user]);

    useEffect(() => {
        const { selectedCommunity } = communityState;
        if (selectedCommunity) {
            getCommunityTopics(selectedCommunity.id!);
        }
    }, [
        communityState.selectedCommunity?.id,
        communityState.topic.input.page,
        communityState.topic.input.searchValue,
    ]);

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
                    onNextTopic: () => {
                        setCommunityState((prev) => ({
                            ...prev,
                            topic: {
                                ...prev.topic,
                                input: {
                                    ...prev.topic.input,
                                    page: prev.topic.input.page + 1,
                                    isNext: true,
                                },
                            },
                        }));
                    },
                    onPrevTopic: () => {
                        setCommunityState((prev) => ({
                            ...prev,
                            topic: {
                                ...prev.topic,
                                input: {
                                    ...prev.topic.input,
                                    page: prev.topic.input.page - 1,
                                    isNext: false,
                                },
                            },
                        }));
                    },
                    searchTopic: (searchValue) => {
                        setCommunityState((prev) => ({
                            ...prev,
                            topic: {
                                ...prev.topic,
                                input: {
                                    ...prev.topic.input,
                                    searchValue,
                                },
                            },
                        }));
                    },
                },
                communityState,
            }}
        >
            {children}
        </CommunityContext.Provider>
    );
};
