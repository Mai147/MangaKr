import useSearch from "@/hooks/useSearch";
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import React from "react";
import HorizontalSkeleton from "@/components/Skeleton/HorizontalSkeleton";
import UserHorizontalSnippetItem from "@/components/User/Snippet/UserHorizontalSnippetItem";
import { UserModel } from "@/models/User";
import UserUtils from "@/utils/UserUtils";

type SearchUserTabProps = {};

const SearchUserTab: React.FC<SearchUserTabProps> = () => {
    const { searchState } = useSearch();
    return (
        <Box w="100%">
            {searchState.user.loading ? (
                [1, 2, 3].map((idx) => <HorizontalSkeleton key={idx} />)
            ) : searchState.user.output.list.length > 0 ? (
                <Grid
                    templateColumns={"repeat(2, minmax(0, 1fr))"}
                    gap={2}
                    mb={4}
                >
                    {searchState.user.output.list.map((user: UserModel) => (
                        <GridItem key={user.uid}>
                            <UserHorizontalSnippetItem
                                user={UserUtils.toUserSnippet(user)}
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
export default SearchUserTab;
