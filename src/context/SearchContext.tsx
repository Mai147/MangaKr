import { SEARCH_PAGE_COUNT } from "@/constants/pagination";
import usePagination, {
    defaultPaginationInput,
    PaginationInput,
} from "@/hooks/usePagination";
import { Author } from "@/models/Author";
import { Book } from "@/models/Book";
import { Community } from "@/models/Community";
import { Review } from "@/models/Review";
import { UserModel } from "@/models/User";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

interface SearchBookState extends PaginationInput {
    books: Book[];
}

interface SearchReviewState extends PaginationInput {
    reviews: Review[];
}

interface SearchAuthorState extends PaginationInput {
    authors: Author[];
}

interface SearchCommunityState extends PaginationInput {
    communities: Community[];
}

interface SearchUserState extends PaginationInput {
    users: UserModel[];
}

type tabList = "book" | "review" | "author" | "community" | "user";

type SearchState = {
    searchValue: string;
    book: SearchBookState;
    review: SearchReviewState;
    author: SearchAuthorState;
    community: SearchCommunityState;
    user: SearchUserState;
    slideToNextPage: (tab: tabList) => void;
    slideToPrevPage: (tab: tabList) => void;
};

const defaultSearchBookState: SearchBookState = {
    ...defaultPaginationInput,
    books: [],
    pageCount: SEARCH_PAGE_COUNT,
};

const defaultSearchReviewState: SearchReviewState = {
    ...defaultPaginationInput,
    reviews: [],
    pageCount: SEARCH_PAGE_COUNT,
};

const defaultSearchAuthorState: SearchAuthorState = {
    ...defaultPaginationInput,
    authors: [],
    pageCount: SEARCH_PAGE_COUNT,
};

const defaultSearchCommunityState: SearchCommunityState = {
    ...defaultPaginationInput,
    communities: [],
    pageCount: SEARCH_PAGE_COUNT,
};

const defaultSearchUserState: SearchUserState = {
    ...defaultPaginationInput,
    users: [],
    pageCount: SEARCH_PAGE_COUNT,
};

const defaultSearchState: SearchState = {
    searchValue: "",
    book: defaultSearchBookState,
    review: defaultSearchReviewState,
    author: defaultSearchAuthorState,
    community: defaultSearchCommunityState,
    user: defaultSearchUserState,
    slideToNextPage: () => {},
    slideToPrevPage: () => {},
};

export const SearchContext = createContext<SearchState>(defaultSearchState);

export const SearchProvider = ({ children }: any) => {
    const rounter = useRouter();
    const { getBooks, getReviews, getAuthors, getCommunities, getUsers } =
        usePagination();
    const [searchValue, setSearchValue] = useState("");
    const [bookTab, setBookTab] = useState<SearchBookState>(
        defaultSearchBookState
    );
    const [reviewTab, setReviewTab] = useState<SearchReviewState>(
        defaultSearchReviewState
    );
    const [authorTab, setAuthorTab] = useState<SearchAuthorState>(
        defaultSearchAuthorState
    );
    const [communityTab, setCommunityTab] = useState<SearchCommunityState>(
        defaultSearchCommunityState
    );
    const [userTab, setUserTab] = useState<SearchUserState>(
        defaultSearchUserState
    );

    const getSearchBooks = async (searchValue: string) => {
        setBookTab((prev) => ({
            ...prev,
            loading: true,
        }));
        const res = await getBooks({
            page: bookTab.page,
            isNext: bookTab.isNext,
            pageCount: bookTab.pageCount,
            searchValue: searchValue,
            isFirst: bookTab.isFirst,
        });
        setBookTab((prev) => ({
            ...prev,
            books: res?.books as Book[],
            totalPage: res?.totalPage || 0,
            loading: false,
        }));
    };

    const getSearchReviews = async (searchValue: string) => {
        setReviewTab((prev) => ({
            ...prev,
            loading: true,
        }));
        const res = await getReviews({
            page: reviewTab.page,
            isNext: reviewTab.isNext,
            pageCount: reviewTab.pageCount,
            searchValue,
        });
        setReviewTab((prev) => ({
            ...prev,
            reviews: res?.reviews || [],
            totalPage: res?.totalPage || 0,
            loading: false,
        }));
    };

    const getSearchAuthors = async (searchValue: string) => {
        setAuthorTab((prev) => ({
            ...prev,
            loading: true,
        }));
        const res = await getAuthors({
            page: authorTab.page,
            isNext: authorTab.isNext,
            pageCount: authorTab.pageCount,
            searchValue,
        });
        setAuthorTab((prev) => ({
            ...prev,
            authors: res?.authors || [],
            totalPage: res?.totalPage || 0,
            loading: false,
        }));
    };

    const getSearchCommunitites = async (searchValue: string) => {
        setCommunityTab((prev) => ({
            ...prev,
            loading: true,
        }));
        const res = await getCommunities({
            page: communityTab.page,
            isNext: communityTab.isNext,
            pageCount: communityTab.pageCount,
            searchValue,
        });
        setCommunityTab((prev) => ({
            ...prev,
            communities: res?.communities || [],
            totalPage: res?.totalPage || 0,
            loading: false,
        }));
    };

    const getSearchUsers = async (searchValue: string) => {
        setUserTab((prev) => ({
            ...prev,
            loading: true,
        }));
        const res = await getUsers({
            page: communityTab.page,
            isNext: communityTab.isNext,
            pageCount: communityTab.pageCount,
            searchValue,
        });
        setUserTab((prev) => ({
            ...prev,
            users: (res?.users as UserModel[]) || [],
            totalPage: res?.totalPage || 0,
            loading: false,
        }));
    };

    const slideToNextPage = (tab: tabList) => {
        switch (tab) {
            case "book": {
                setBookTab((prev) => ({
                    ...prev,
                    page: prev.page + 1,
                    isNext: true,
                }));
                break;
            }
            case "review": {
                setReviewTab((prev) => ({
                    ...prev,
                    page: prev.page + 1,
                    isNext: true,
                }));
                break;
            }
            case "author": {
                setAuthorTab((prev) => ({
                    ...prev,
                    page: prev.page + 1,
                    isNext: true,
                }));
                break;
            }
            case "community": {
                setCommunityTab((prev) => ({
                    ...prev,
                    page: prev.page + 1,
                    isNext: true,
                }));
                break;
            }
            case "user": {
                setUserTab((prev) => ({
                    ...prev,
                    page: prev.page + 1,
                    isNext: true,
                }));
            }
        }
    };

    const slideToPrevPage = (tab: tabList) => {
        switch (tab) {
            case "book": {
                setBookTab((prev) => ({
                    ...prev,
                    page: prev.page - 1,
                    isNext: false,
                }));
                break;
            }
            case "review": {
                setReviewTab((prev) => ({
                    ...prev,
                    page: prev.page - 1,
                    isNext: false,
                }));
                break;
            }
            case "author": {
                setAuthorTab((prev) => ({
                    ...prev,
                    page: prev.page - 1,
                    isNext: false,
                }));
                break;
            }
            case "community": {
                setCommunityTab((prev) => ({
                    ...prev,
                    page: prev.page - 1,
                    isNext: false,
                }));
                break;
            }
            case "user": {
                setUserTab((prev) => ({
                    ...prev,
                    page: prev.page - 1,
                    isNext: false,
                }));
                break;
            }
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
        setBookTab(defaultSearchBookState);
        setReviewTab(defaultSearchReviewState);
        setAuthorTab(defaultSearchAuthorState);
        setCommunityTab(defaultSearchCommunityState);
        setUserTab(defaultSearchUserState);
    }, [searchValue]);

    useEffect(() => {
        getSearchBooks(searchValue);
        if (bookTab.isFirst) {
            setBookTab((prev) => ({
                ...prev,
                isFirst: false,
            }));
        }
    }, [bookTab.page, bookTab.isFirst]);

    useEffect(() => {
        getSearchReviews(searchValue);
        if (reviewTab.isFirst) {
            setReviewTab((prev) => ({
                ...prev,
                isFirst: false,
            }));
        }
    }, [reviewTab.page, reviewTab.isFirst]);

    useEffect(() => {
        getSearchAuthors(searchValue);
        if (authorTab.isFirst) {
            setAuthorTab((prev) => ({
                ...prev,
                isFirst: false,
            }));
        }
    }, [authorTab.page, authorTab.isFirst]);

    useEffect(() => {
        getSearchCommunitites(searchValue);
        if (communityTab.isFirst) {
            setCommunityTab((prev) => ({
                ...prev,
                isFirst: false,
            }));
        }
    }, [communityTab.page, communityTab.isFirst]);

    useEffect(() => {
        getSearchUsers(searchValue);
        if (userTab.isFirst) {
            setUserTab((prev) => ({
                ...prev,
                isFirst: false,
            }));
        }
    }, [userTab.page, userTab.isFirst]);

    return (
        <SearchContext.Provider
            value={{
                searchValue,
                book: bookTab,
                review: reviewTab,
                author: authorTab,
                community: communityTab,
                user: userTab,
                slideToNextPage,
                slideToPrevPage,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};
