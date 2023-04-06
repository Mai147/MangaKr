import PageContent from "@/components/Layout/PageContent";
import RightSidebar from "@/components/Layout/Sidebar/RightSidebar";
import Pagination from "@/components/Pagination";
import ReviewSnippetItem from "@/components/Review/Snippet/ReviewSnippetItem";
import HorizontalSkeleton from "@/components/Skeleton/HorizontalSkeleton";
import { REVIEW_PAGE_COUNT } from "@/constants/pagination";
import { routes } from "@/constants/routes";
import usePagination, {
    defaultPaginationInput,
    PaginationInput,
} from "@/hooks/usePagination";
import { Review } from "@/models/Review";
import { Box, Divider, Text, VStack } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import React, { useEffect, useState } from "react";

type ReviewPageProps = {
    bookId?: string;
};

const ReviewPage: React.FC<ReviewPageProps> = ({ bookId }) => {
    const [reviewPaginationInput, setReviewPaginationInput] =
        useState<PaginationInput>({
            ...defaultPaginationInput,
            pageCount: REVIEW_PAGE_COUNT,
            loading: true,
        });
    const [reviews, setReviews] = useState<Review[]>([]);
    const { getReviews } = usePagination();

    const getListReviews = async () => {
        setReviewPaginationInput((prev) => ({
            ...prev,
            loading: true,
        }));
        const res = await getReviews({ ...reviewPaginationInput, bookId });
        if (res.reviews) {
            setReviews(res.reviews);
        }
        setReviewPaginationInput((prev) => ({
            ...prev,
            totalPage: res.totalPage || 0,
            loading: false,
            isFirst: false,
        }));
    };

    useEffect(() => {
        getListReviews();
    }, [reviewPaginationInput.page]);

    return (
        <PageContent>
            <Box flexGrow={1}>
                <Text fontSize={24} fontWeight={600}>
                    Bài đánh giá
                </Text>
                <Divider my={4} borderColor="gray.400" />
                {reviewPaginationInput.loading ? (
                    [1, 2, 3, 4].map((e, idx) => (
                        <HorizontalSkeleton key={idx} />
                    ))
                ) : reviews.length <= 0 ? (
                    <Text align="center" mt={10}>
                        Không có bài đánh giá nào!
                    </Text>
                ) : (
                    <VStack spacing={4} mb={4} align="flex-start">
                        {reviews.map((review) => (
                            <ReviewSnippetItem
                                key={review.id}
                                review={review}
                                href={routes.getReviewDetailPage(
                                    review.bookId,
                                    review.id!
                                )}
                            />
                        ))}
                    </VStack>
                )}
                <Pagination
                    page={reviewPaginationInput.page}
                    totalPage={reviewPaginationInput.totalPage}
                    onNext={() => {
                        setReviewPaginationInput((prev) => ({
                            ...prev,
                            page: prev.page + 1,
                            isNext: true,
                        }));
                    }}
                    onPrev={() => {
                        setReviewPaginationInput((prev) => ({
                            ...prev,
                            page: prev.page - 1,
                            isNext: false,
                        }));
                    }}
                />
            </Box>
            <RightSidebar />
        </PageContent>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { bookId } = context.query;

    if (bookId) {
        return {
            props: {
                bookId,
            },
        };
    }
    return {
        props: {},
    };
}

export default ReviewPage;
