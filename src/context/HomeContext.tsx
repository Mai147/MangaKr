import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { Author } from "@/models/Author";
import { Book } from "@/models/Book";
import { Community } from "@/models/Community";
import { Review } from "@/models/Review";
import AuthorService from "@/services/AuthorService";
import BookService from "@/services/BookService";
import CommunityService from "@/services/CommunityService";
import ReviewService from "@/services/ReviewService";
import { createContext, useEffect, useState } from "react";

type Field =
    | "bannerBooks"
    | "newestMangas"
    | "mostPopularMangas"
    | "mostFavoriteAuthors"
    | "mostPopularCommunities"
    | "newestReviews";

type HomeState = {
    bannerBooks: {
        list: Book[];
        loading: boolean;
    };
    newestMangas: {
        list: Book[];
        loading: boolean;
    };
    mostPopularMangas: {
        list: Book[];
        loading: boolean;
    };
    mostFavoriteAuthors: {
        list: Author[];
        loading: boolean;
    };
    mostPopularCommunities: {
        list: Community[];
        loading: boolean;
    };
    newestReviews: {
        list: Review[];
        loading: boolean;
    };
};

const defaultState = {
    list: [],
    loading: false,
};

const defaultHomeState: HomeState = {
    bannerBooks: defaultState,
    newestMangas: defaultState,
    mostPopularMangas: defaultState,
    mostFavoriteAuthors: defaultState,
    mostPopularCommunities: defaultState,
    newestReviews: defaultState,
};

export const HomeContext = createContext<HomeState>(defaultHomeState);

export const HomeProvider = ({ children }: any) => {
    const [homeState, setHomeState] = useState<HomeState>(defaultHomeState);

    const get = async (field: Field, getFunc: () => Promise<any>) => {
        setHomeState((prev) => ({
            ...prev,
            [field]: {
                ...prev[field],
                loading: true,
            },
        }));
        const res = await getFunc();
        setHomeState((prev) => ({
            ...prev,
            [field]: {
                ...prev[field],
                loading: false,
                list: res,
            },
        }));
    };

    useEffect(() => {
        get(
            "bannerBooks",
            async () =>
                await BookService.getAll({
                    bookOrders: [
                        {
                            bookOrderBy: "rating",
                            bookOrderDirection: "desc",
                        },
                    ],
                    bookLimit: 5,
                })
        );
        get(
            "mostPopularMangas",
            async () =>
                await BookService.getAll({
                    bookOrders: [
                        {
                            bookOrderBy: "popularity",
                            bookOrderDirection: "desc",
                        },
                    ],
                    bookLimit: 6,
                })
        );
        get(
            "newestMangas",
            async () =>
                await BookService.getAll({
                    bookOrders: [
                        {
                            bookOrderBy: "publishedDate",
                            bookOrderDirection: "desc",
                        },
                    ],
                    bookLimit: 6,
                })
        );
        get(
            "mostFavoriteAuthors",
            async () =>
                await AuthorService.getAll({
                    authorOrders: [
                        {
                            authorOrderBy: "numberOfLikes",
                            authorOrderDirection: "desc",
                        },
                    ],
                })
        );
        get(
            "newestReviews",
            async () =>
                await ReviewService.getAll({
                    reviewOrders: [
                        {
                            reviewOrderBy: "createdAt",
                            reviewOrderDirection: "desc",
                        },
                    ],
                    reviewLimit: 6,
                })
        );
        get(
            "mostPopularCommunities",
            async () =>
                await CommunityService.getAll({
                    communityLimit: 5,
                    communityOrders: [
                        {
                            communityOrderBy: "numberOfMembers",
                            communityOrderDirection: "desc",
                        },
                    ],
                })
        );
    }, []);

    return (
        <HomeContext.Provider value={homeState}>
            {children}
        </HomeContext.Provider>
    );
};
