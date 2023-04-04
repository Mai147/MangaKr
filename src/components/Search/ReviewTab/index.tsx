import Pagination from "@/components/Pagination";
import ReviewSnippetItem from "@/components/Review/Snippet/ReviewSnippetItem";
import HorizontalSkeleton from "@/components/Skeleton/HorizontalSkeleton";
import { routes } from "@/constants/routes";
import useSearch from "@/hooks/useSearch";
import { Box, Text } from "@chakra-ui/react";
import React from "react";

type SearchReviewTabProps = {};

const SearchReviewTab: React.FC<SearchReviewTabProps> = () => {
    const { review, slideToNextPage, slideToPrevPage } = useSearch();
    return (
        <Box w="100%">
            {review.loading ? (
                [1, 2, 3].map((idx) => <HorizontalSkeleton key={idx} />)
            ) : review.reviews.length > 0 ? (
                review.reviews.map((review) => (
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
            <Pagination
                page={review.page}
                totalPage={review.totalPage}
                onNext={() => slideToNextPage("review")}
                onPrev={() => slideToPrevPage("review")}
            />
        </Box>
    );
};
export default SearchReviewTab;
