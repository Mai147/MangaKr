import BookSnippetHorizontalItem from "@/components/Book/Snippet/BookSnippetHorizontalItem";
import BookSnippetHorizontalSkeleton from "@/components/Book/Snippet/BookSnippetHorizontalSkeleton";
import PageContent from "@/components/Layout/PageContent";
import RightSidebar from "@/components/Layout/Sidebar/RightSidebar";
import Pagination from "@/components/Pagination";
import Tag from "@/components/Tag";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { BOOK_PAGE_COUNT } from "@/constants/pagination";
import { BOOK_PAGE } from "@/constants/routes";
import { fireStore } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import usePagination from "@/hooks/usePagination";
import { Book } from "@/models/Book";
import { Genre } from "@/models/Genre";
import { Box, Divider, Flex, Spinner, Text } from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type BookPageProps = {};

const BookPage: React.FC<BookPageProps> = ({}) => {
    const router = useRouter();
    const [genreId, setGenreId] = useState<string | undefined>(undefined);
    const [isFirst, setIsFirst] = useState(true);
    const [bookLoading, setBookLoading] = useState(false);
    const [genreLoading, setGenreLoading] = useState(false);
    const [totalPage, setTotalPage] = useState(1);
    const [page, setPage] = useState(1);
    const [isNext, setIsNext] = useState<boolean | null>(true);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const { getBooks } = usePagination();
    const { setNeedAuth } = useAuth();

    const getListBook = async () => {
        setBookLoading(true);
        const listBook = await getBooks({
            page,
            pageCount: BOOK_PAGE_COUNT,
            isNext: isNext!,
            genreId,
            isFirst,
        });
        if (listBook) {
            setBooks(listBook.books);
            setTotalPage(listBook.totalPage || 0);
        }
        setBookLoading(false);
        setIsNext(null);
    };

    const getGenres = async () => {
        setGenreLoading(true);
        const genreDocsRef = collection(
            fireStore,
            firebaseRoute.getAllGenreRoute()
        );
        const genreDocs = await getDocs(genreDocsRef);
        const genres = genreDocs.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as Genre)
        );
        setGenres(genres);
        setGenreLoading(false);
    };

    useEffect(() => {
        setNeedAuth(false);
    }, []);

    useEffect(() => {
        getGenres();
    }, []);

    useEffect(() => {
        setPage(1);
        setTotalPage(1);
        setIsNext(true);
        setIsFirst(true);
    }, [genreId]);

    useEffect(() => {
        setGenreId(router.query.genreId as string);
    }, [router.query]);

    useEffect(() => {
        getListBook();
        if (isFirst) {
            setIsFirst(false);
        }
    }, [page, isFirst]);

    return (
        <PageContent>
            <Box flexGrow={1}>
                <Text fontSize={24} fontWeight={600}>
                    Tìm kiếm manga
                </Text>
                <Divider my={4} />
                <Flex justify="center" mb={6}>
                    <Box mx={2}>
                        <Tag
                            label="Tất cả"
                            isActive={!genreId}
                            onClick={() => {
                                router.push(BOOK_PAGE);
                            }}
                        />
                    </Box>
                    {genreLoading && <Spinner />}
                    {genres.map((genre) => (
                        <Box key={genre.id} mx={2}>
                            <Tag
                                label={genre.name}
                                isActive={genreId === genre.id}
                                onClick={() => {
                                    router.push(
                                        `${BOOK_PAGE}?genreId=${genre.id}`
                                    );
                                }}
                            />
                        </Box>
                    ))}
                </Flex>
                {bookLoading &&
                    [1, 2, 3, 4].map((e, idx) => (
                        <BookSnippetHorizontalSkeleton key={idx} />
                    ))}
                {books.length <= 0 ? (
                    <Text align="center" mt={10}>
                        Không có manga nào!
                    </Text>
                ) : (
                    books.map((book) => (
                        <BookSnippetHorizontalItem key={book.id} book={book} />
                    ))
                )}
                <Pagination
                    page={page}
                    setPage={setPage}
                    totalPage={totalPage}
                    onNext={() => {
                        setIsNext(true);
                    }}
                    onPrev={() => {
                        setIsNext(false);
                    }}
                />
            </Box>
            <RightSidebar />
        </PageContent>
    );
};
export default BookPage;
