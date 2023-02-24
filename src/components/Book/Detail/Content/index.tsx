import ReviewSnippetItem from "@/components/Review/Snippet/ReviewSnippetItem";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { BOOK_REVIEW_PAGE_COUNT } from "@/constants/pagination";
import { getBookReviewDetailPage, getBookReviewPage } from "@/constants/routes";
import { fireStore } from "@/firebase/clientApp";
import { Book } from "@/models/Book";
import { Review } from "@/models/Review";
import { Box, Divider, Skeleton, SkeletonText, Text } from "@chakra-ui/react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import BookDetailSection from "./Section";

type BookDetailContentProps = {
    book: Book;
};

const BookDetailContent: React.FC<BookDetailContentProps> = ({ book }) => {
    const [bookReviews, setBookReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);

    const getBookReviews = async (bookId: string) => {
        setLoading(true);
        const reviewDocsRef = collection(
            fireStore,
            firebaseRoute.getAllReviewRoute()
        );
        const reviewQuery = query(
            reviewDocsRef,
            where("bookId", "==", bookId),
            limit(BOOK_REVIEW_PAGE_COUNT)
        );
        const reviewDocs = await getDocs(reviewQuery);
        const reviews = reviewDocs.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as Review)
        );
        setBookReviews(reviews);
        setLoading(false);
    };

    useEffect(() => {
        getBookReviews(book.id!);
    }, []);
    return (
        <Box>
            <BookDetailSection
                title="Tóm tắt"
                children={<Text>{book.description}</Text>}
            />
            <Divider my={4} />
            <BookDetailSection title="Nội dung">
                <div
                    dangerouslySetInnerHTML={{
                        __html: book.plot || "",
                    }}
                    className="ck ck-content"
                ></div>
            </BookDetailSection>
            <Divider my={4} />
            <BookDetailSection title="Nhân vật">
                <div
                    dangerouslySetInnerHTML={{
                        __html: book.characters || "",
                    }}
                    className="ck ck-content"
                ></div>
            </BookDetailSection>
            <Divider my={4} />
            <BookDetailSection
                title="Bài đánh giá"
                seeMoreHref={
                    bookReviews.length > 0
                        ? getBookReviewPage(book.id!)
                        : undefined
                }
            >
                {loading && (
                    <Box>
                        <Skeleton
                            w="100%"
                            h="50px"
                            fadeDuration={0.4}
                            speed={0.8}
                        />
                        <SkeletonText
                            mt="4"
                            noOfLines={3}
                            spacing="4"
                            skeletonHeight="2"
                            fadeDuration={0.4}
                            speed={0.8}
                        />
                    </Box>
                )}
                {bookReviews.length === 0 ? (
                    <Box p={6} boxShadow="lg">
                        Chưa có bài đánh giá nào
                    </Box>
                ) : (
                    bookReviews.map((review) => (
                        <ReviewSnippetItem
                            key={review.id}
                            review={review}
                            href={getBookReviewDetailPage(
                                review.bookId,
                                review.id!
                            )}
                        />
                    ))
                )}
            </BookDetailSection>
        </Box>
    );
};
export default BookDetailContent;
