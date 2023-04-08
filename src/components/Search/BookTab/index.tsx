import BookSnippetHorizontalItem from "@/components/Book/Snippet/BookSnippetHorizontalItem";
import HorizontalSkeleton from "@/components/Skeleton/HorizontalSkeleton";
import useSearch from "@/hooks/useSearch";
import { Book } from "@/models/Book";
import { Box, Text } from "@chakra-ui/react";
import React from "react";

type SearchBookTabProps = {};

const SearchBookTab: React.FC<SearchBookTabProps> = () => {
    const { searchState } = useSearch();

    return (
        <Box w="100%">
            {searchState.book.loading ? (
                [1, 2, 3].map((idx) => <HorizontalSkeleton key={idx} />)
            ) : searchState.book.output.list.length > 0 ? (
                searchState.book.output.list.map((book: Book) => (
                    <BookSnippetHorizontalItem book={book} key={book.id} />
                ))
            ) : (
                <Text align="center" fontSize={18}>
                    Không có kết quả cần tìm
                </Text>
            )}
        </Box>
    );
};
export default SearchBookTab;
