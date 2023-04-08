import ReviewSnippetItem from "@/components/Review/Snippet/ReviewSnippetItem";
import HorizontalSkeleton from "@/components/Skeleton/HorizontalSkeleton";
import { routes } from "@/constants/routes";
import useSearch from "@/hooks/useSearch";
import { Review } from "@/models/Review";
import { Box, Text } from "@chakra-ui/react";
import React from "react";

type SearchReviewTabProps = {};

const SearchReviewTab: React.FC<SearchReviewTabProps> = () => {
    const { searchState } = useSearch();
    return (
        <Box w="100%">
            {searchState.review.loading ? (
                [1, 2, 3].map((idx) => <HorizontalSkeleton key={idx} />)
            ) : searchState.review.output.list.length > 0 ? (
                searchState.review.output.list.map((review: Review) => (
                    <ReviewSnippetItem
                        key={review.id}
                        review={review}
                        mb={4}
                        href={routes.getReviewDetailPage(
                            review.bookId,
                            review.id!
                        )}
                    />
                ))
            ) : (
                <Text align="center" fontSize={18}>
                    Không có kết quả cần tìm
                </Text>
            )}
        </Box>
    );
};
export default SearchReviewTab;
