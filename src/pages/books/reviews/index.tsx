import PageContent from "@/components/Layout/PageContent";
import RightSidebar from "@/components/Layout/Sidebar/RightSidebar";
import Pagination from "@/components/Pagination";
import ReviewSnippetItem from "@/components/Review/Snippet/ReviewSnippetItem";
import HorizontalSkeleton from "@/components/Skeleton/HorizontalSkeleton";
import { REVIEW_PAGE_COUNT } from "@/constants/pagination";
import { routes } from "@/constants/routes";
import usePagination, {
    defaultPaginationInput,
    defaultPaginationOutput,
    PaginationOutput,
    ReviewPaginationInput,
} from "@/hooks/usePagination";
import { Book } from "@/models/Book";
import { Review } from "@/models/Review";
import BookService from "@/services/BookService";
import { Box, Divider, Text, VStack } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";

type ReviewPageProps = {
    bookId?: string;
};

const ReviewPage: React.FC<ReviewPageProps> = ({ bookId }) => {
    const [reviewPaginationInput, setReviewPaginationInput] =
        useState<ReviewPaginationInput>({
            ...defaultPaginationInput,
            pageCount: REVIEW_PAGE_COUNT,
            bookId,
            setDocValue: (docValue) => {
                setReviewPaginationInput((prev) => ({
                    ...prev,
                    docValue,
                }));
            },
        });
    const [reviewPaginationOutput, setReviewPaginationOutput] =
        useState<PaginationOutput>(defaultPaginationOutput);
    const [book, setBook] = useState<Book | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const { getReviews } = usePagination();

    const getListReviews = async () => {
        setLoading(true);
        const res = await getReviews(reviewPaginationInput);
        if (bookId) {
            const bookRes = await BookService.get({ bookId });
            if (bookRes) {
                setBook(bookRes.book!);
            }
        }
        if (res) {
            setReviewPaginationOutput(res);
            setReviewPaginationInput((prev) => ({
                ...prev,
                isFirst: false,
            }));
        }
        setLoading(false);
    };

    useEffect(() => {
        getListReviews();
    }, [reviewPaginationInput.page]);

    return (
        <>
            <Head>
                <title>MangaKr - Review</title>
            </Head>
            <>
                <PageContent>
                    <Box flexGrow={1} p={4}>
                        <Text fontSize={24} fontWeight={600}>
                            Bài đánh giá
                        </Text>
                        {book && (
                            <Text>
                                Kết quả tìm kiếm cho <b>{book.name}</b>{" "}
                            </Text>
                        )}
                        <Divider my={4} borderColor="gray.400" />
                        {loading ? (
                            [1, 2, 3, 4].map((e, idx) => (
                                <HorizontalSkeleton key={idx} />
                            ))
                        ) : reviewPaginationOutput.list.length <= 0 ? (
                            <Text align="center" mt={10}>
                                Không có bài đánh giá nào!
                            </Text>
                        ) : (
                            <VStack
                                spacing={{ base: 3, md: 4 }}
                                mb={4}
                                align="flex-start"
                            >
                                {reviewPaginationOutput.list.map(
                                    (review: Review) => (
                                        <ReviewSnippetItem
                                            key={review.id}
                                            review={review}
                                            href={routes.getReviewDetailPage(
                                                review.bookId,
                                                review.id!
                                            )}
                                        />
                                    )
                                )}
                            </VStack>
                        )}
                        <Pagination
                            page={reviewPaginationOutput.page}
                            totalPage={reviewPaginationOutput.totalPage}
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
            </>
        </>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { bookId } = context.query;
    return {
        props: {
            bookId: bookId || null,
        },
    };
}

export default ReviewPage;
