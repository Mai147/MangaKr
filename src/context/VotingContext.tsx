import { POST_PAGE_COUNT } from "@/constants/pagination";
import useAuth from "@/hooks/useAuth";
import useDebounce from "@/hooks/useDebounce";
import useModal from "@/hooks/useModal";
import usePagination, {
    defaultPaginationInput,
    defaultPaginationOutput,
    PaginationOutput,
    VotingPaginationInput,
} from "@/hooks/usePagination";
import { Community } from "@/models/Community";
import { UserSnippet } from "@/models/User";
import { Voting } from "@/models/Vote";
import VotingService from "@/services/VotingService";
import { createContext, ReactNode, useEffect, useState } from "react";

type VotingState = {
    input: VotingPaginationInput;
    votingPaginationOutput: PaginationOutput;
    selectedVoting?: {
        voting: Voting;
        userVoteOptionId?: string;
        selectedVotingOption?: {
            votingOptionId: string;
            userVotes: UserSnippet[];
        };
    };
    loading: {
        getVotings: boolean;
        getVotingOptions?: boolean;
        getUserVote?: boolean;
        getVotingOptionVote?: boolean;
    };
};

type VotingAction = {
    onNext: () => void;
    onPrev: () => void;
    search: (searchValue: string) => void;
    handleVote: (voteOptionId: string) => Promise<void>;
    switchVotingOption: (votingOptionId: string) => void;
};

type VotingContextState = {
    votingState: VotingState;
    votingAction: VotingAction;
};

const defaultVotingInputState: VotingPaginationInput = {
    ...defaultPaginationInput,
    communityId: "",
    isAccept: true,
    pageCount: POST_PAGE_COUNT,
};

const defaultVotingState: VotingState = {
    input: defaultVotingInputState,
    votingPaginationOutput: defaultPaginationOutput,
    loading: {
        getVotings: false,
    },
};

const defaultVotingAction: VotingAction = {
    onNext: () => {},
    onPrev: () => {},
    search: () => {},
    handleVote: async () => {},
    switchVotingOption: () => {},
};

const defaultVotingContextState: VotingContextState = {
    votingState: defaultVotingState,
    votingAction: defaultVotingAction,
};

export const VotingContext = createContext<VotingContextState>(
    defaultVotingContextState
);

export const VotingProvider = ({
    children,
    community,
    voting,
}: {
    children: ReactNode;
    community: Community;
    voting?: Voting;
}) => {
    const { user } = useAuth();
    const { toggleView } = useModal();
    const [votingState, setVotingState] =
        useState<VotingState>(defaultVotingState);

    const debouncedSearch = useDebounce(
        votingState.input.searchValue || "",
        300
    );
    const { getVotings } = usePagination();

    const getListVoting = async (communityId: string) => {
        setVotingState((prev) => ({
            ...prev,
            loading: {
                ...prev.loading,
                getVotings: true,
            },
        }));
        const input: VotingPaginationInput = {
            ...votingState.input,
            communityId,
            isAccept: true,
            isLock: false,
            setDocValue: (docValue) => {
                setVotingState((prev) => ({
                    ...prev,
                    input: {
                        ...prev.input,
                        docValue,
                    },
                }));
            },
        };
        const res = await getVotings(input);
        if (res) {
            for (const index in res.list) {
                const voting = res.list[index];
                const votingVoteSnippets =
                    await VotingService.getVotingVoteSnippet({
                        votingId: voting.id,
                        userId: user?.uid,
                    });
                res.list[index] = {
                    ...res.list[index],
                    votingVoteSnippets,
                };
            }
            setVotingState((prev) => ({
                ...prev,
                votingPaginationOutput: res,
                input: {
                    ...prev.input,
                    isFirst: false,
                },
            }));
        }
        setVotingState((prev) => ({
            ...prev,
            loading: {
                ...prev.loading,
                getVotings: false,
            },
        }));
    };

    const getListVotingOptions = async (
        communityId: string,
        votingId: string
    ) => {
        setVotingState((prev) => ({
            ...prev,
            loading: {
                ...prev.loading,
                getVotingOptions: true,
            },
        }));
        const res = await VotingService.getOptions({
            communityId,
            votingId,
        });
        if (res) {
            setVotingState((prev) => ({
                ...prev,
                selectedVoting: {
                    ...prev.selectedVoting,
                    voting: {
                        ...prev.selectedVoting!.voting,
                        options: res,
                    },
                },
            }));
        }
        setVotingState((prev) => ({
            ...prev,
            loading: {
                ...prev.loading,
                getVotingOptions: false,
            },
        }));
    };

    const getListVotingOptionVote = async () => {
        if (votingState.selectedVoting?.selectedVotingOption) {
            setVotingState((prev) => ({
                ...prev,
                loading: {
                    ...prev.loading,
                    getVotingOptionVote: true,
                },
            }));
            const res = await VotingService.getOptionVotes({
                communityId: community.id!,
                votingId: votingState.selectedVoting.voting.id!,
                votingOptionId:
                    votingState.selectedVoting.selectedVotingOption
                        .votingOptionId,
            });
            setVotingState((prev) => ({
                ...prev,
                selectedVoting: {
                    ...prev.selectedVoting!,
                    selectedVotingOption: {
                        ...prev.selectedVoting!.selectedVotingOption!,
                        userVotes: res,
                    },
                },
                loading: {
                    ...prev.loading,
                    getVotingOptionVote: false,
                },
            }));
        }
    };

    const getUserVote = async (userId: string, votingId: string) => {
        setVotingState((prev) => ({
            ...prev,
            loading: {
                ...prev.loading,
                getUserVote: true,
            },
        }));
        const res = await VotingService.getVote({ userId, votingId });
        setVotingState((prev) => ({
            ...prev,
            selectedVoting: {
                ...prev.selectedVoting!,
                userVoteOptionId: res?.votingOptionId,
            },
        }));
        setVotingState((prev) => ({
            ...prev,
            loading: {
                ...prev.loading,
                getUserVote: false,
            },
        }));
    };

    const handleVote = async (voteOptionId: string) => {
        if (!user) {
            toggleView("login");
            return;
        }
        if (!votingState.selectedVoting) return;
        try {
            const res = await VotingService.vote({
                user,
                communityId: community.id!,
                votingId: votingState.selectedVoting.voting.id!,
                votingOptionId: voteOptionId,
                userVoteOptionId: votingState.selectedVoting.userVoteOptionId,
            });
            if (res) {
                setVotingState((prev) => ({
                    ...prev,
                    selectedVoting: {
                        ...prev.selectedVoting!,
                        userVoteOptionId:
                            voteOptionId !==
                            votingState.selectedVoting?.userVoteOptionId
                                ? voteOptionId
                                : undefined,
                        voting: {
                            ...prev.selectedVoting!.voting,
                            numberOfVotes:
                                prev.selectedVoting!.voting.numberOfVotes +
                                res.totalChange,
                            options: prev.selectedVoting!.voting.options.map(
                                (option) => {
                                    const currentUserVoting =
                                        prev.selectedVoting!.userVoteOptionId;
                                    if (
                                        option.id !== voteOptionId &&
                                        option.id !== currentUserVoting
                                    ) {
                                        return option;
                                    } else if (
                                        option.id === currentUserVoting
                                    ) {
                                        return {
                                            ...option,
                                            numberOfVotes:
                                                option.numberOfVotes +
                                                res.currentChange,
                                        };
                                    } else {
                                        return {
                                            ...option,
                                            numberOfVotes:
                                                option.numberOfVotes +
                                                res.voteChange,
                                        };
                                    }
                                }
                            ),
                        },
                    },
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setVotingState((prev) => ({
            ...prev,
            selectedVoting: voting && {
                voting,
            },
        }));
        if (voting) {
            getListVotingOptions(community.id!, voting.id!);
        }
    }, [voting]);

    useEffect(() => {
        if (user && voting) {
            getUserVote(user.uid, voting.id!);
        }
    }, [user, voting]);

    useEffect(() => {
        setVotingState((prev) => ({
            ...prev,
            input: {
                ...defaultVotingInputState,
                searchValue: prev.input.searchValue,
            },
        }));
    }, [debouncedSearch]);

    useEffect(() => {
        getListVoting(community.id!);
    }, [community, votingState.input.page, debouncedSearch]);

    useEffect(() => {
        if (votingState.selectedVoting?.selectedVotingOption?.votingOptionId) {
            getListVotingOptionVote();
        }
    }, [votingState.selectedVoting?.selectedVotingOption?.votingOptionId]);

    return (
        <VotingContext.Provider
            value={{
                votingState,
                votingAction: {
                    onNext: () => {
                        setVotingState((prev) => ({
                            ...prev,
                            input: {
                                ...prev.input,
                                page: prev.input.page + 1,
                            },
                            isNext: true,
                        }));
                    },
                    onPrev: () => {
                        setVotingState((prev) => ({
                            ...prev,
                            input: {
                                ...prev.input,
                                page: prev.input.page - 1,
                            },
                            isNext: false,
                        }));
                    },
                    search: (searchValue) => {
                        setVotingState((prev) => ({
                            ...prev,
                            input: {
                                ...prev.input,
                                searchValue,
                            },
                        }));
                    },
                    handleVote,
                    switchVotingOption: (votingOptionId) => {
                        setVotingState((prev) => ({
                            ...prev,
                            selectedVoting: {
                                ...prev.selectedVoting!,
                                selectedVotingOption: {
                                    ...prev.selectedVoting
                                        ?.selectedVotingOption!,
                                    votingOptionId,
                                },
                            },
                        }));
                    },
                },
            }}
        >
            {children}
        </VotingContext.Provider>
    );
};
