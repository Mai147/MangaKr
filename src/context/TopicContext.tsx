import { TOPIC_PAGE_COUNT } from "@/constants/pagination";
import useDebounce from "@/hooks/useDebounce";
import usePagination, {
    defaultPaginationInput,
    defaultPaginationOutput,
    PaginationOutput,
    TopicPaginationInput,
} from "@/hooks/usePagination";
import { Community } from "@/models/Community";
import { createContext, ReactNode, useEffect, useState } from "react";

type TopicState = {
    input: TopicPaginationInput;
    output: PaginationOutput;
    loading: {
        getTopics: boolean;
    };
};

type TopicAction = {
    onNext: () => void;
    onPrev: () => void;
    search: (searchValue: string) => void;
};

type TopicContextState = {
    topicState: TopicState;
    topicAction: TopicAction;
};

const defaultTopicInputState: TopicPaginationInput = {
    ...defaultPaginationInput,
    communityId: "",
    isAccept: true,
    pageCount: TOPIC_PAGE_COUNT,
};

const defaultTopicState: TopicState = {
    input: defaultTopicInputState,
    output: defaultPaginationOutput,
    loading: {
        getTopics: false,
    },
};

const defaultTopicAction: TopicAction = {
    onNext: () => {},
    onPrev: () => {},
    search: () => {},
};

const defaultTopicContextState: TopicContextState = {
    topicState: defaultTopicState,
    topicAction: defaultTopicAction,
};

export const TopicContext = createContext<TopicContextState>(
    defaultTopicContextState
);

export const TopicProvider = ({
    children,
    community,
}: {
    children: ReactNode;
    community: Community;
}) => {
    const [topicState, setTopicState] = useState<TopicState>(defaultTopicState);
    const { getTopics } = usePagination();
    const debouncedSearch = useDebounce(
        topicState.input.searchValue || "",
        300
    );

    const getListTopic = async (communityId: string) => {
        setTopicState((prev) => ({
            ...prev,
            loading: {
                ...prev.loading,
                getTopics: true,
            },
        }));
        const input: TopicPaginationInput = {
            ...topicState.input,
            communityId,
            isAccept: true,
            isLock: false,
            setDocValue: (docValue) => {
                setTopicState((prev) => ({
                    ...prev,
                    input: {
                        ...prev.input,
                        docValue,
                    },
                }));
            },
        };
        const res = await getTopics(input);
        if (res) {
            setTopicState((prev) => ({
                ...prev,
                output: res,
                input: {
                    ...prev.input,
                    isFirst: false,
                },
            }));
        }
        setTopicState((prev) => ({
            ...prev,
            loading: {
                ...prev.loading,
                getTopics: false,
            },
        }));
    };

    useEffect(() => {
        setTopicState((prev) => ({
            ...prev,
            input: {
                ...defaultTopicInputState,
                searchValue: prev.input.searchValue,
            },
        }));
    }, [debouncedSearch]);

    useEffect(() => {
        getListTopic(community.id!);
    }, [community, topicState.input.page, debouncedSearch]);

    return (
        <TopicContext.Provider
            value={{
                topicState,
                topicAction: {
                    onNext: () => {
                        setTopicState((prev) => ({
                            ...prev,
                            input: {
                                ...prev.input,
                                page: prev.input.page + 1,
                            },
                            isNext: true,
                        }));
                    },
                    onPrev: () => {
                        setTopicState((prev) => ({
                            ...prev,
                            input: {
                                ...prev.input,
                                page: prev.input.page - 1,
                            },
                            isNext: false,
                        }));
                    },
                    search: (searchValue) => {
                        setTopicState((prev) => ({
                            ...prev,
                            input: {
                                ...prev.input,
                                searchValue,
                            },
                        }));
                    },
                },
            }}
        >
            {children}
        </TopicContext.Provider>
    );
};
