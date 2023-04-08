import useSearch from "@/hooks/useSearch";
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import React from "react";
import AuthorSnippetHorizontalItem from "@/components/Author/Snippet/AuthorSnippetHorizontalItem";
import HorizontalSkeleton from "@/components/Skeleton/HorizontalSkeleton";
import { Author } from "@/models/Author";

type SearchAuthorTabProps = {};

const SearchAuthorTab: React.FC<SearchAuthorTabProps> = () => {
    const { searchState } = useSearch();
    return (
        <Box w="100%">
            {searchState.author.loading ? (
                [1, 2, 3].map((idx) => <HorizontalSkeleton key={idx} />)
            ) : searchState.author.output.list.length > 0 ? (
                <Grid
                    templateColumns={"repeat(2, minmax(0, 1fr))"}
                    gap={2}
                    mb={4}
                >
                    {searchState.author.output.list.map((author: Author) => (
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
        </Box>
    );
};
export default SearchAuthorTab;
