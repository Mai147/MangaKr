import { BOOK_PAGE_COUNT } from "@/constants/pagination";
import usePagination, {
    BookPaginationInput,
    defaultPaginationInput,
    FilterValue,
} from "@/hooks/usePagination";
import { Book } from "@/models/Book";
import { Genre } from "@/models/Genre";
import GenreService from "@/services/GenreService";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

const defaultBookPaginationInput: BookPaginationInput = {
    ...defaultPaginationInput,
    pageCount: BOOK_PAGE_COUNT,
    filter: "rating",
};

type BookState = {
    bookList: Book[];
    bookLoading: boolean;
    genreList: Genre[];
    genreLoading: boolean;
    selectedGenre?: Genre;
    selectedFilter?: FilterValue;
    page: number;
    totalPage: number;
    slideToNextPage: () => void;
    slideToPrevPage: () => void;
    onChangeFilter: (filter: FilterValue) => void;
};

const defaultBookState: BookState = {
    bookList: [],
    bookLoading: false,
    genreLoading: false,
    genreList: [],
    page: defaultPaginationInput.page,
    totalPage: defaultPaginationInput.totalPage,
    selectedFilter: "rating",
    slideToNextPage: () => {},
    slideToPrevPage: () => {},
    onChangeFilter: () => {},
};

export const BookContext = createContext<BookState>(defaultBookState);

export const BookProvider = ({ children }: any) => {
    const [bookState, setBookState] = useState<BookState>(defaultBookState);
    const [paginationInput, setPaginationInput] = useState<BookPaginationInput>(
        defaultBookPaginationInput
    );
    const router = useRouter();
    const { getBooks } = usePagination();

    const getListBook = async () => {
        setBookState((prev) => ({
            ...prev,
            bookLoading: true,
        }));
        const listBook = await getBooks({
            ...paginationInput,
        });
        if (listBook) {
            setBookState((prev) => ({
                ...prev,
                bookList: listBook.books,
            }));
            setPaginationInput((prev) => ({
                ...prev,
                totalPage: listBook.totalPage || 0,
            }));
        }
        setBookState((prev) => ({
            ...prev,
            bookLoading: false,
        }));
    };

    const getGenres = async () => {
        setBookState((prev) => ({
            ...prev,
            genreLoading: true,
        }));
        const genres = await GenreService.getAll({});
        setBookState((prev) => ({
            ...prev,
            genreList: genres as Genre[],
            genreLoading: false,
        }));
    };

    const slideToNextPage = () => {
        setPaginationInput((prev) => ({
            ...prev,
            isNext: true,
            page: prev.page + 1,
        }));
    };

    const slideToPrevPage = () => {
        setPaginationInput((prev) => ({
            ...prev,
            isNext: false,
            page: prev.page - 1,
        }));
    };

    const onChangeFilter = (filter: FilterValue) => {
        setPaginationInput((prev) => ({
            ...prev,
            filter,
        }));
    };

    useEffect(() => {
        getGenres();
    }, []);

    useEffect(() => {
        const selectedGenre = bookState.genreList.find(
            (genre) => genre.id === paginationInput.genreId
        );
        setPaginationInput((prev) => ({
            ...defaultBookPaginationInput,
            filter: undefined,
            genreId: prev.genreId,
        }));
        setBookState((prev) => ({
            ...prev,
            selectedGenre,
        }));
    }, [paginationInput.genreId]);

    useEffect(() => {
        setPaginationInput((prev) => ({
            ...defaultBookPaginationInput,
            filter: prev.filter,
        }));
    }, [paginationInput.filter]);

    useEffect(() => {
        setPaginationInput((prev) => ({
            ...prev,
            genreId: router.query.genreId as string,
        }));
    }, [router.query]);

    useEffect(() => {
        getListBook();
        if (paginationInput.isFirst) {
            setPaginationInput((prev) => ({
                ...prev,
                isFirst: false,
            }));
        }
    }, [paginationInput.page, paginationInput.filter, paginationInput.isFirst]);

    useEffect(() => {
        setBookState((prev) => ({
            ...prev,
            page: paginationInput.page,
            totalPage: paginationInput.totalPage,
            selectedFilter: paginationInput.filter,
        }));
    }, [
        paginationInput.page,
        paginationInput.totalPage,
        paginationInput.filter,
    ]);

    return (
        <BookContext.Provider
            value={{
                ...bookState,
                slideToNextPage,
                slideToPrevPage,
                onChangeFilter,
            }}
        >
            {children}
        </BookContext.Provider>
    );
};
