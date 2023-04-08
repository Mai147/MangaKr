import { BOOK_PAGE_COUNT } from "@/constants/pagination";
import useTestPagination, {
    BookPaginationInput,
    defaultPaginationInput,
    defaultPaginationOutput,
    PaginationOutput,
} from "@/hooks/useTestPagination";
import { FilterValue } from "@/models/Book";
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
    bookPaginationInput: BookPaginationInput;
    bookPaginationOutput: PaginationOutput;
    genreList: Genre[];
    selectedGenre?: Genre;
    loading: {
        getGenre: boolean;
        getBook: boolean;
    };
};

type BookAction = {
    onNext: () => void;
    onPrev: () => void;
    onChangeFilter: (filter: FilterValue) => void;
};

type BookContextState = {
    bookState: BookState;
    bookAction: BookAction;
};

const defaultBookState: BookState = {
    bookPaginationInput: defaultBookPaginationInput,
    bookPaginationOutput: defaultPaginationOutput,
    genreList: [],
    loading: {
        getGenre: false,
        getBook: false,
    },
};

const defaultBookAction: BookAction = {
    onNext: () => {},
    onPrev: () => {},
    onChangeFilter: () => {},
};

const defaulBookContextState: BookContextState = {
    bookState: defaultBookState,
    bookAction: defaultBookAction,
};

export const BookContext = createContext<BookContextState>(
    defaulBookContextState
);

export const BookProvider = ({ children }: any) => {
    const [bookState, setBookState] = useState<BookState>(defaultBookState);
    const router = useRouter();
    const { getBooks } = useTestPagination();

    const getListBook = async () => {
        setBookState((prev) => ({
            ...prev,
            loading: {
                ...prev.loading,
                getBook: true,
            },
        }));
        const input: BookPaginationInput = {
            ...bookState.bookPaginationInput,
            setDocValue: (docValue) => {
                setBookState((prev) => ({
                    ...prev,
                    bookPaginationInput: {
                        ...prev.bookPaginationInput,
                        docValue,
                    },
                }));
            },
        };
        const res = await getBooks(input);
        if (res) {
            setBookState((prev) => ({
                ...prev,
                bookPaginationOutput: res,
                bookPaginationInput: {
                    ...prev.bookPaginationInput,
                    isFirst: false,
                },
            }));
        }
        setBookState((prev) => ({
            ...prev,
            loading: {
                ...prev.loading,
                getBook: false,
            },
        }));
    };

    const getGenres = async () => {
        setBookState((prev) => ({
            ...prev,
            loading: {
                ...prev.loading,
                getGenre: true,
            },
        }));
        const genres = await GenreService.getAll({});
        setBookState((prev) => ({
            ...prev,
            genreList: genres as Genre[],
            loading: {
                ...prev.loading,
                getGenre: false,
            },
        }));
    };

    useEffect(() => {
        getGenres();
    }, []);

    useEffect(() => {
        const selectedGenre = bookState.genreList.find(
            (genre) => genre.id === bookState.bookPaginationInput.genreId
        );
        setBookState((prev) => ({
            ...prev,
            bookPaginationInput: {
                ...defaultBookPaginationInput,
                filter: undefined,
                genreId: prev.bookPaginationInput.genreId,
            },
            selectedGenre,
        }));
    }, [bookState.bookPaginationInput.genreId]);

    useEffect(() => {
        setBookState((prev) => ({
            ...prev,
            bookPaginationInput: {
                ...defaultBookPaginationInput,
                filter: prev.bookPaginationInput.filter,
            },
        }));
    }, [bookState.bookPaginationInput.filter]);

    useEffect(() => {
        setBookState((prev) => ({
            ...prev,
            bookPaginationInput: {
                ...prev.bookPaginationInput,
                genreId: router.query.genreId as string,
            },
        }));
    }, [router.query]);

    useEffect(() => {
        getListBook();
    }, [
        bookState.bookPaginationInput.page,
        bookState.bookPaginationInput.filter,
        bookState.bookPaginationInput.genreId,
    ]);

    return (
        <BookContext.Provider
            value={{
                bookState,
                bookAction: {
                    onNext: () => {
                        setBookState((prev) => ({
                            ...prev,
                            bookPaginationInput: {
                                ...prev.bookPaginationInput,
                                page: prev.bookPaginationInput.page + 1,
                                isNext: true,
                            },
                        }));
                    },
                    onPrev: () => {
                        setBookState((prev) => ({
                            ...prev,
                            bookPaginationInput: {
                                ...prev.bookPaginationInput,
                                page: prev.bookPaginationInput.page - 1,
                                isNext: false,
                            },
                        }));
                    },
                    onChangeFilter: (filter) => {
                        setBookState((prev) => ({
                            ...prev,
                            bookPaginationInput: {
                                ...prev.bookPaginationInput,
                                filter,
                            },
                        }));
                    },
                },
            }}
        >
            {children}
        </BookContext.Provider>
    );
};
