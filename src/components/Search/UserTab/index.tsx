import Pagination from "@/components/Pagination";
import useSearch from "@/hooks/useSearch";
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import React from "react";
import HorizontalSkeleton from "@/components/Skeleton/HorizontalSkeleton";
import UserHorizontalSnippetItem from "@/components/User/Snippet/UserHorizontalSnippetItem";

type SearchUserTabProps = {};

const SearchUserTab: React.FC<SearchUserTabProps> = () => {
    const { user, slideToNextPage, slideToPrevPage } = useSearch();
    console.log(user);
    return (
        <Box w="100%">
            {user.loading ? (
                [1, 2, 3].map((idx) => <HorizontalSkeleton key={idx} />)
            ) : user.users.length > 0 ? (
                <Grid
                    templateColumns={"repeat(2, minmax(0, 1fr))"}
                    gap={2}
                    mb={4}
                >
                    {user.users.map((user) => (
                        <GridItem key={user.uid}>
                            <UserHorizontalSnippetItem user={user} h="100%" />
                        </GridItem>
                    ))}
                </Grid>
            ) : (
                <Text align="center" fontSize={18}>
                    Không có kết quả cần tìm
                </Text>
            )}
            <Pagination
                page={user.page}
                totalPage={user.totalPage}
                onNext={() => slideToNextPage("user")}
                onPrev={() => slideToPrevPage("user")}
            />
        </Box>
    );
};
export default SearchUserTab;
