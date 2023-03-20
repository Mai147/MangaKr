import BookSnippetHorizontalSkeleton from "@/components/Book/Snippet/BookSnippetHorizontalSkeleton";
import BookTopSnippetItem from "@/components/Book/Snippet/BookTopSnippetItem";
import PageContent from "@/components/Layout/PageContent";
import RightSidebar from "@/components/Layout/Sidebar/RightSidebar";
import Pagination from "@/components/Pagination";
import { BOOK_PAGE_COUNT } from "@/constants/pagination";
import useAuth from "@/hooks/useAuth";
import usePagination from "@/hooks/usePagination";
import { Book } from "@/models/Book";
import { Divider, Flex, Box, Text, Select } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

type BookTopPageProps = {};

type FilterValue = "rating" | "popularity" | "numberOfReviews";

type FilterLabel = "Điểm Đánh Giá" | "Số Người Đọc" | "Số Bài Đánh Giá";

type Filter = {
    label: FilterLabel;
    value: FilterValue;
};

const filterList: Filter[] = [
    {
        label: "Số Người Đọc",
        value: "popularity",
    },
    {
        label: "Số Bài Đánh Giá",
        value: "numberOfReviews",
    },
    {
        label: "Điểm Đánh Giá",
        value: "rating",
    },
];

const BookTopPage: React.FC<BookTopPageProps> = () => {
    const { setNeedAuth } = useAuth();
    const { getBooks } = usePagination();
    const [filter, setFilter] = useState("rating");
    const [bookLoading, setBookLoading] = useState(false);
    const [books, setBooks] = useState<Book[]>([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [isNext, setIsNext] = useState<boolean | null>(true);
    const [firstRank, setFirstRank] = useState(1);

    const getListBook = async () => {
        setBookLoading(true);
        setFirstRank((page - 1) * BOOK_PAGE_COUNT + 1);
        const listBook = await getBooks({
            page,
            pageCount: BOOK_PAGE_COUNT,
            isNext: isNext!,
            filter,
        });
        if (listBook) {
            setBooks(listBook.books);
            setTotalPage(listBook.totalPage || 0);
        }
        setBookLoading(false);
        setIsNext(null);
    };

    useEffect(() => {
        setNeedAuth(false);
    }, []);

    useEffect(() => {
        getListBook();
    }, [page, filter]);

    return (
        <PageContent>
            <Box flexGrow={1}>
                <Text fontSize={24} fontWeight={600}>
                    Manga hàng đầu
                </Text>
                <Divider my={4} />
                <Flex justify="center" mb={10}>
                    <Select
                        onChange={(event) => {
                            setPage(1);
                            setIsNext(true);
                            setFilter(event.target.value);
                        }}
                        value={filter}
                    >
                        {filterList.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </Select>
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
                    books.map((book, idx) => (
                        <BookTopSnippetItem
                            key={book.id}
                            rank={firstRank + idx}
                            book={book}
                        />
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
export default BookTopPage;
