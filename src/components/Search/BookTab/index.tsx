import BookSnippetHorizontalItem from "@/components/Book/Snippet/BookSnippetHorizontalItem";
import Pagination from "@/components/Pagination";
import HorizontalSkeleton from "@/components/Skeleton/HorizontalSkeleton";
import useSearch from "@/hooks/useSearch";
import { Box, Text } from "@chakra-ui/react";
import React from "react";

type SearchBookTabProps = {};

const SearchBookTab: React.FC<SearchBookTabProps> = () => {
    const { book, slideToNextPage, slideToPrevPage } = useSearch();
    return (
        <Box w="100%">
            {book.loading ? (
                [1, 2, 3].map((idx) => <HorizontalSkeleton key={idx} />)
            ) : book.books.length > 0 ? (
                book.books.map((book) => (
                    <BookSnippetHorizontalItem book={book} key={book.id} />
                ))
            ) : (
                <Text align="center" fontSize={18}>
                    Không có kết quả cần tìm
                </Text>
            )}
            <Pagination
                page={book.page}
                totalPage={book.totalPage}
                onNext={() => slideToNextPage("book")}
                onPrev={() => slideToPrevPage("book")}
            />
        </Box>
    );
};
export default SearchBookTab;
