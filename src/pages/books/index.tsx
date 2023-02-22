import BookSnippetHorizontalItem from "@/components/Book/Snippet/BookSnippetHorizontalItem";
import BookSnippetHorizontalSkeleton from "@/components/Book/Snippet/BookSnippetHorizontalSkeleton";
import PageContent from "@/components/Layout/PageContent";
import RightSidebar from "@/components/Layout/Sidebar/RightSidebar";
import Pagination from "@/components/Pagination";
import Tag from "@/components/Tag";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { BOOK_PAGE } from "@/constants/routes";
import { fireStore } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import useBook from "@/hooks/useBook";
import { Book } from "@/models/Book";
import { Genre } from "@/models/Genre";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { collection, doc, getDocs } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type BookPageProps = {
    genreId: string | null;
};

const BookPage: React.FC<BookPageProps> = ({ genreId }) => {
    const [bookLoading, setBookLoading] = useState(false);
    const [genreLoading, setGenreLoading] = useState(false);
    const [totalPage, setTotalPage] = useState(1);
    const [page, setPage] = useState(1);
    const [isNext, setIsNext] = useState<boolean | null>(true);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const { getBooks } = useBook();
    const { setNeedAuth } = useAuth();

    const getListBook = async () => {
        setBookLoading(true);
        const listBook = await getBooks({
            page,
            pageCount: 2,
            isNext: isNext!,
            genreId: genreId || undefined,
        });
        if (listBook) {
            setBooks(listBook.books);
            setTotalPage(listBook.totalPage);
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
        getListBook();
    }, [page]);

    return (
        <PageContent>
            <Box flexGrow={1}>
                <Flex justify="center">
                    <Box mx={2}>
                        <Tag
                            label="Tất cả"
                            isActive={!genreId}
                            href={`${BOOK_PAGE}`}
                        />
                    </Box>
                    {genreLoading && <Spinner />}
                    {genres.map((genre) => (
                        <Box key={genre.id} mx={2}>
                            <Tag
                                label={genre.name}
                                isActive={genreId === genre.id}
                                href={`${BOOK_PAGE}?genreId=${genre.id}`}
                            />
                        </Box>
                    ))}
                </Flex>
                {bookLoading &&
                    [1, 2, 3, 4].map((e, idx) => (
                        <BookSnippetHorizontalSkeleton key={idx} />
                    ))}
                {books.map((book) => (
                    <BookSnippetHorizontalItem key={book.id} book={book} />
                ))}
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { genreId } = context.query;
    return {
        props: {
            genreId: genreId || null,
        },
    };
}

export default BookPage;
