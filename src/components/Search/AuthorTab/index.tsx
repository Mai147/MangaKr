import BookSnippetHorizontalSkeleton from "@/components/Book/Snippet/BookSnippetHorizontalSkeleton";
import Pagination from "@/components/Pagination";
import useSearch from "@/hooks/useSearch";
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import React from "react";
import AuthorSnippetHorizontalItem from "@/components/Author/Snippet/AuthorSnippetHorizontalItem";

type SearchAuthorTabProps = {};

const SearchAuthorTab: React.FC<SearchAuthorTabProps> = () => {
    const { author, slideToNextPage, slideToPrevPage } = useSearch();
    return (
        <Box w="100%">
            {author.loading ? (
                [1, 2, 3].map((idx) => (
                    <BookSnippetHorizontalSkeleton key={idx} />
                ))
            ) : author.authors.length > 0 ? (
                <Grid templateColumns={"repeat(2, 1fr)"} gap={2} mb={4}>
                    {author.authors.map((author) => (
                        <GridItem key={author.id}>
                            <AuthorSnippetHorizontalItem
                                author={author}
                                h="100%"
                            />
                        </GridItem>
                    ))}
                </Grid>
            ) : (
                <Text align="center" fontSize={18}>
                    Không có kết quả cần tìm
                </Text>
            )}
            <Pagination
                page={author.page}
                totalPage={author.totalPage}
                onNext={() => slideToNextPage("author")}
                onPrev={() => slideToPrevPage("author")}
            />
        </Box>
    );
};
export default SearchAuthorTab;
