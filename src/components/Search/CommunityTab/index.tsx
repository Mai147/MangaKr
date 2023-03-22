import CommunitySnippetHorizontalItem from "@/components/Community/Snippet/CommunitySnippetHorizontalItem";
import Pagination from "@/components/Pagination";
import HorizontalSkeleton from "@/components/Skeleton/HorizontalSkeleton";
import useSearch from "@/hooks/useSearch";
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import React from "react";

type SearchCommunityTabProps = {};

const SearchCommunityTab: React.FC<SearchCommunityTabProps> = () => {
    const { community, slideToNextPage, slideToPrevPage } = useSearch();
    return (
        <Box w="100%">
            {community.loading ? (
                [1, 2, 3].map((idx) => <HorizontalSkeleton key={idx} />)
            ) : community.communities.length > 0 ? (
                <Grid
                    templateColumns={"repeat(2, minmax(0, 1fr))"}
                    gap={2}
                    mb={4}
                >
                    {community.communities.map((community) => (
                        <GridItem key={community.id}>
                            <CommunitySnippetHorizontalItem
                                community={community}
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
                page={community.page}
                totalPage={community.totalPage}
                onNext={() => slideToNextPage("community")}
                onPrev={() => slideToPrevPage("community")}
            />
        </Box>
    );
};
export default SearchCommunityTab;
