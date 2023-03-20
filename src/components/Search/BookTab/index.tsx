import BookSnippetHorizontalItem from "@/components/Book/Snippet/BookSnippetHorizontalItem";
import BookSnippetHorizontalSkeleton from "@/components/Book/Snippet/BookSnippetHorizontalSkeleton";
import Pagination from "@/components/Pagination";
import useSearch from "@/hooks/useSearch";
import { Box, Text } from "@chakra-ui/react";
import React from "react";

type SearchBookTabProps = {};

const SearchBookTab: React.FC<SearchBookTabProps> = () => {
    const { book, slideToNextPage, slideToPrevPage } = useSearch();
    return (
        <Box w="100%">
            {book.loading ? (
                [1, 2, 3].map((idx) => (
                    <BookSnippetHorizontalSkeleton key={idx} />
                ))
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
