import BookSnippetHorizontalSkeleton from "@/components/Book/Snippet/BookSnippetHorizontalSkeleton";
import PageContent from "@/components/Layout/PageContent";
import RightSidebar from "@/components/Layout/Sidebar/RightSidebar";
import Pagination from "@/components/Pagination";
import ReviewSnippetItem from "@/components/Review/Snippet/ReviewSnippetItem";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { BOOK_PAGE_COUNT } from "@/constants/pagination";
import { getBookReviewDetailPage } from "@/constants/routes";
import { fireStore } from "@/firebase/clientApp";
import { Review } from "@/models/Review";
import { Box, Divider, Text, VStack } from "@chakra-ui/react";
import {
    QueryDocumentSnapshot,
    DocumentData,
    collection,
    getCountFromServer,
    query,
    startAfter,
    limit,
    endBefore,
    limitToLast,
    orderBy,
    getDocs,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

type ReviewPageProps = {};

const ReviewPage: React.FC<ReviewPageProps> = () => {
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [isNext, setIsNext] = useState<boolean | null>(true);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [firstReviewDoc, setFirstReviewDocs] =
        useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [lastReviewDoc, setLastReviewDoc] =
        useState<QueryDocumentSnapshot<DocumentData> | null>(null);

    const getReviews = async ({
        page,
        pageCount,
        isNext,
    }: {
        page: number;
        pageCount: number;
        isNext: boolean;
    }) => {
        const reviewDocsRef = collection(
            fireStore,
            firebaseRoute.getAllReviewRoute()
        );
        const queryConstraints = [];
        const snapShot = await getCountFromServer(
            query(reviewDocsRef, orderBy("createdAt"))
        );
        const totalPage = Math.ceil(snapShot.data().count / pageCount);
        if (isNext) {
            if (lastReviewDoc) {
                if (page <= totalPage) {
                    queryConstraints.push(startAfter(lastReviewDoc));
                    queryConstraints.push(limit(pageCount));
                } else return;
            }
        } else {
            if (page >= 1) {
                queryConstraints.push(endBefore(firstReviewDoc));
                queryConstraints.push(limitToLast(pageCount));
            } else return;
        }
        const reviewQuery = query(
            reviewDocsRef,
            orderBy("createdAt"),
            limit(pageCount),
            ...queryConstraints
        );
        const reviewDocs = await getDocs(reviewQuery);
        const reviews = reviewDocs.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as Review)
        );
        setFirstReviewDocs(reviewDocs.docs[0]);
        setLastReviewDoc(reviewDocs.docs[reviewDocs.docs.length - 1]);
        return {
            reviews,
            totalPage,
        };
    };

    const getListReviews = async () => {
        setReviewLoading(true);
        const listReview = await getReviews({
            page,
            pageCount: BOOK_PAGE_COUNT,
            isNext: isNext!,
        });
        if (listReview) {
            setReviews(listReview.reviews);
            setTotalPage(listReview.totalPage);
        }
        setReviewLoading(false);
        setIsNext(null);
    };

    useEffect(() => {
        getListReviews();
    }, [page]);

    return (
        <PageContent>
            <Box flexGrow={1}>
                <Text fontSize={24} fontWeight={600}>
                    Bài đánh giá
                </Text>
                <Divider my={4} />
                {reviewLoading ? (
                    [1, 2, 3, 4].map((e, idx) => (
                        <BookSnippetHorizontalSkeleton key={idx} />
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
                                href={getBookReviewDetailPage(
                                    review.bookId,
                                    review.id!
                                )}
                            />
                        ))}
                    </VStack>
                )}
                <Pagination
                    page={page}
                    setPage={setPage}
                    totalPage={totalPage}
                    onNext={() => {
                        setIsNext(true);
                    }}
                    onPrev={() => {
                        setIsNext(false);
                    }}
                />
            </Box>
            <RightSidebar />
        </PageContent>
    );
};

export default ReviewPage;
