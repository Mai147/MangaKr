import CommunitySnippetHorizontalItem from "@/components/Community/Snippet/CommunitySnippetHorizontalItem";
import HorizontalSkeleton from "@/components/Skeleton/HorizontalSkeleton";
import useSearch from "@/hooks/useSearch";
import { Community } from "@/models/Community";
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import React from "react";

type SearchCommunityTabProps = {};

const SearchCommunityTab: React.FC<SearchCommunityTabProps> = () => {
    const { searchState } = useSearch();
    return (
        <Box w="100%">
            {searchState.community.loading ? (
                [1, 2, 3].map((idx) => <HorizontalSkeleton key={idx} />)
            ) : searchState.community.output.list.length > 0 ? (
                <Grid
                    templateColumns={{
                        base: "repeat(1, minmax(0, 1fr))",
                        md: "repeat(2, minmax(0, 1fr))",
                    }}
                    gap={2}
                    mb={4}
                >
                    {searchState.community.output.list.map(
                        (community: Community) => (
                            <GridItem key={community.id}>
                                <CommunitySnippetHorizontalItem
                                    community={community}
                                    h="100%"
                                />
                            </GridItem>
                        )
                    )}
                </Grid>
            ) : (
                <Text align="center" fontSize={18}>
                    Không có kết quả cần tìm
                </Text>
            )}
        </Box>
    );
};
export default SearchCommunityTab;
