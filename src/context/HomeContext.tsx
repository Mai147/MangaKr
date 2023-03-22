import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { Author } from "@/models/Author";
import { Book } from "@/models/Book";
import { Review } from "@/models/Review";
import BookUtils from "@/utils/BookUtils";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";

type HomeState = {
    bannerBooks: Book[];
    newestMangas: Book[];
    mostPopularMangas: Book[];
    mostFavoriteAuthors: Author[];
    newestReviews: Review[];
    bannerBooksLoading: boolean;
    newestMangasLoading: boolean;
    mostPopularMangasLoading: boolean;
    mostFavoriteAuthorsLoading: boolean;
    newestReviewsLoading: boolean;
};

const defaultHomeState: HomeState = {
    bannerBooks: [],
    newestMangas: [],
    mostPopularMangas: [],
    mostFavoriteAuthors: [],
    newestReviews: [],
    bannerBooksLoading: false,
    mostFavoriteAuthorsLoading: false,
    mostPopularMangasLoading: false,
    newestMangasLoading: false,
    newestReviewsLoading: false,
};

export const HomeContext = createContext<HomeState>(defaultHomeState);

export const HomeProvider = ({ children }: any) => {
    const [homeState, setHomeState] = useState<HomeState>(defaultHomeState);

    const getBanners = async () => {
        setHomeState((prev) => ({
            ...prev,
            bannerBooksLoading: true,
        }));
        const bookDocsRef = collection(
            fireStore,
            firebaseRoute.getAllBookRoute()
        );
        const bannerBookQuery = query(
            bookDocsRef,
            orderBy("rating", "desc"),
            limit(5)
        );
        const bannerDocs = await getDocs(bannerBookQuery);
        const bannerBooks: Book[] = BookUtils.fromDocs(bannerDocs.docs);
        setHomeState((prev) => ({
            ...prev,
            bannerBooks: bannerBooks,
            bannerBooksLoading: false,
        }));
    };

    const getNewestMangas = async () => {
        setHomeState((prev) => ({
            ...prev,
            newestMangasLoading: true,
        }));
        const bookDocsRef = collection(
            fireStore,
            firebaseRoute.getAllBookRoute()
        );
        const newestMangaQuery = query(
            bookDocsRef,
            orderBy("publishedDate", "desc"),
            limit(6)
        );
        const newestMangaDocs = await getDocs(newestMangaQuery);
        const newestMangas: Book[] = BookUtils.fromDocs(newestMangaDocs.docs);
        setHomeState((prev) => ({
            ...prev,
            newestMangas,
            newestMangasLoading: false,
        }));
    };

    const getMostPopularMangas = async () => {
        setHomeState((prev) => ({
            ...prev,
            mostPopularMangasLoading: true,
        }));
        const bookDocsRef = collection(
            fireStore,
            firebaseRoute.getAllBookRoute()
        );
        const mostPopularMangaQuery = query(
            bookDocsRef,
            orderBy("popularity", "desc"),
            limit(6)
        );

        const mostPopularMangaDocs = await getDocs(mostPopularMangaQuery);
        const mostPopularMangas: Book[] = BookUtils.fromDocs(
            mostPopularMangaDocs.docs
        );
        setHomeState((prev) => ({
            ...prev,
            mostPopularMangas,
            mostPopularMangasLoading: false,
        }));
    };

    const getMostFavoriteAuthors = async () => {
        setHomeState((prev) => ({
            ...prev,
            mostFavoriteAuthorsLoading: true,
        }));
        const authorDocRef = collection(
            fireStore,
            firebaseRoute.getAllAuthorRoute()
        );
        const mostFavoriteAuthorQuery = query(
            authorDocRef,
            orderBy("numberOfLikes", "desc"),
            limit(6)
        );

        const mostFavoriteAuthorDocs = await getDocs(mostFavoriteAuthorQuery);
        const mostFavoriteAuthors: Author[] = mostFavoriteAuthorDocs.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as Author)
        );
        setHomeState((prev) => ({
            ...prev,
            mostFavoriteAuthors,
            mostFavoriteAuthorsLoading: false,
        }));
    };

    const getNewestReviews = async () => {
        setHomeState((prev) => ({
            ...prev,
            newestReviewsLoading: true,
        }));

        const reviewDocsRef = collection(
            fireStore,
            firebaseRoute.getAllReviewRoute()
        );

        const newestReviewQuery = query(
            reviewDocsRef,
            orderBy("createdAt", "desc"),
            limit(6)
        );
        const newestReviewDocs = await getDocs(newestReviewQuery);

        const newestReviews: Review[] = newestReviewDocs.docs.map(
            (doc) =>
                JSON.parse(
                    JSON.stringify({
                        id: doc.id,
                        ...doc.data(),
                    })
                ) as Review
        );
        setHomeState((prev) => ({
            ...prev,
            newestReviews,
            newestReviewsLoading: false,
        }));
    };

    useEffect(() => {
        getBanners();
        getNewestMangas();
        getMostPopularMangas();
        getMostFavoriteAuthors();
        getNewestReviews();
    }, []);

    return (
        <HomeContext.Provider value={homeState}>
            {children}
        </HomeContext.Provider>
    );
};
