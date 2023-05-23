import { SEARCH_PAGE_COUNT } from "@/constants/pagination";
import usePagination, {
    BookPaginationInput,
    CommunityPaginationInput,
    defaultPaginationInput,
    defaultPaginationOutput,
    PaginationInput,
    PaginationOutput,
    ReviewPaginationInput,
    UserPaginationInput,
} from "@/hooks/usePagination";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

type TabList = "book" | "review" | "author" | "community" | "user";

type SearchState = {
    book: {
        input: BookPaginationInput;
        output: PaginationOutput;
        loading: boolean;
    };
    review: {
        input: ReviewPaginationInput;
        output: PaginationOutput;
        loading: boolean;
    };
    author: {
        input: PaginationInput;
        output: PaginationOutput;
        loading: boolean;
    };
    community: {
        input: CommunityPaginationInput;
        output: PaginationOutput;
        loading: boolean;
    };
    user: {
        input: UserPaginationInput;
        output: PaginationOutput;
        loading: boolean;
    };
    searchValue: string;
    selectedField: TabList;
};

type SearchAction = {
    onNext: () => void;
    onPrev: () => void;
    setSelectedTab: (tab: TabList) => void;
};

type SearchContextState = {
    searchState: SearchState;
    searchAction: SearchAction;
};

const defaultPaginationState = {
    input: {
        ...defaultPaginationInput,
        pageCount: SEARCH_PAGE_COUNT,
    },
    output: defaultPaginationOutput,
    loading: false,
};

const defaultSearchState: SearchState = {
    book: defaultPaginationState,
    author: defaultPaginationState,
    community: defaultPaginationState,
    review: defaultPaginationState,
    user: defaultPaginationState,
    selectedField: "book",
    searchValue: "",
};

const defaultSearchAction: SearchAction = {
    onNext: () => {},
    onPrev: () => {},
    setSelectedTab: () => {},
};

const defaultSearchContextState: SearchContextState = {
    searchState: defaultSearchState,
    searchAction: defaultSearchAction,
};

export const SearchContext = createContext<SearchContextState>(
    defaultSearchContextState
);

export const SearchProvider = ({ children }: any) => {
    const rounter = useRouter();
    const { getBooks, getReviews, getAuthors, getCommunities, getUsers } =
        usePagination();
    const [searchValue, setSearchValue] = useState("");
    const [searchState, setSearchState] =
        useState<SearchState>(defaultSearchState);

    const get = async (field: TabList) => {
        setSearchState((prev) => ({
            ...prev,
            [field]: {
                ...prev[field],
                loading: true,
            },
        }));
        let res: any;
        const input: PaginationInput = {
            ...searchState[searchState.selectedField].input,
            searchValue: searchState.searchValue,
            setDocValue: (docValue) => {
                setSearchState((prev) => ({
                    ...prev,
                    [field]: {
                        ...prev[field],
                        input: {
                            ...prev[field].input,
                            docValue,
                        },
                    },
                }));
            },
        };
        switch (field) {
            case "book":
                res = await getBooks({ ...input, isLock: false });
                break;
            case "author":
                res = await getAuthors(input);
                break;
            case "community":
                res = await getCommunities(input);
                break;
            case "review":
                res = await getReviews(input);
                break;
            case "user":
                res = await getUsers(input);
                break;
        }
        if (res) {
            setSearchState((prev) => ({
                ...prev,
                [field]: {
                    ...prev[field],
                    output: res,
                    loading: false,
                    input: {
                        ...prev[field].input,
                        isFirst: false,
                    },
                },
            }));
        } else {
            setSearchState((prev) => ({
                ...prev,
                [field]: {
                    ...prev[field],
                    loading: false,
                },
            }));
        }
    };

    useEffect(() => {
        const { q } = rounter.query;
        if (q) {
            setSearchValue(q as string);
        } else {
            setSearchValue("");
        }
    }, [rounter.query]);

    useEffect(() => {
        setSearchState((prev) => ({
            ...defaultSearchState,
            searchValue: searchValue,
            selectedField: prev.selectedField,
        }));
    }, [searchValue, searchState.selectedField]);

    useEffect(() => {
        get(searchState.selectedField);
    }, [
        searchState.selectedField,
        searchState[searchState.selectedField].input.page,
        searchState.searchValue,
    ]);

    return (
        <SearchContext.Provider
            value={{
                searchState,
                searchAction: {
                    onNext: () => {
                        setSearchState((prev) => {
                            const x = {
                                ...prev,
                                [prev.selectedField]: {
                                    ...prev[prev.selectedField],
                                    input: {
                                        ...prev[prev.selectedField].input,
                                        page:
                                            prev[prev.selectedField].input
                                                .page + 1,
                                        isNext: true,
                                    },
                                },
                            };
                            console.log(x);
                            return x;
                        });
                    },
                    onPrev: () => {
                        setSearchState((prev) => ({
                            ...prev,
                            [prev.selectedField]: {
                                ...prev[prev.selectedField],
                                input: {
                                    ...prev[prev.selectedField].input,
                                    page:
                                        prev[prev.selectedField].input.page - 1,
                                    isNext: false,
                                },
                            },
                        }));
                    },
                    setSelectedTab: (tab) => {
                        setSearchState((prev) => ({
                            ...prev,
                            selectedField: tab,
                        }));
                    },
                },
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};
