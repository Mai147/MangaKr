import BookSnippetHorizontalSkeleton from "@/components/Book/Snippet/BookSnippetHorizontalSkeleton";
import BookCarousel from "@/components/Book/Snippet/Carousel";
import ReviewSnippetItem from "@/components/Review/Snippet/ReviewSnippetItem";
import Carousel from "@/components/Test/carousel";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { getEditBookReviewPage } from "@/constants/routes";
import { fireStore } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import { Review } from "@/models/Review";
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    query,
    where,
    writeBatch,
} from "firebase/firestore";
import React, { SetStateAction, useEffect, useState } from "react";
import LibrarySection from "../Section";

type LibraryReviewProps = {
    setConfirmTitle: React.Dispatch<SetStateAction<string>>;
    setConfirmContent: React.Dispatch<SetStateAction<string>>;
    setConfirmSubmitFunc: React.Dispatch<
        SetStateAction<() => () => Promise<void>>
    >;
};

const LibraryReview: React.FC<LibraryReviewProps> = ({
    setConfirmContent,
    setConfirmSubmitFunc,
    setConfirmTitle,
}) => {
    const { user } = useAuth();
    const { toggleView } = useModal();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);

    const getReviewGroup = () => {
        let reviewGroup = [];
        let reviewFourthGroup: Review[] = [];
        reviews.forEach((review, idx) => {
            if (idx % 4 === 0) {
                if (reviewFourthGroup.length > 0) {
                    reviewGroup.push(reviewFourthGroup);
                }
                reviewFourthGroup = [];
            }
            reviewFourthGroup.push(review);
        });
        if (reviewFourthGroup.length > 0) {
            reviewGroup.push(reviewFourthGroup);
        }
        return reviewGroup;
    };

    const getBookReviews = async (userId: string) => {
        setLoading(true);
        try {
            const bookReviewDocsRef = collection(
                fireStore,
                firebaseRoute.getAllReviewRoute()
            );
            const bookReviewQuery = query(
                bookReviewDocsRef,
                where("creatorId", "==", userId)
            );
            const bookReviewDocs = await getDocs(bookReviewQuery);
            const bookReviews = bookReviewDocs.docs.map(
                (doc) =>
                    ({
                        id: doc.id,
                        ...doc.data(),
                    } as Review)
            );
            setReviews(bookReviews);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleDeleteReview = async (review: Review) => {
        try {
            const batch = writeBatch(fireStore);
            const reviewDocRef = doc(
                collection(fireStore, firebaseRoute.getAllReviewRoute()),
                review.id
            );
            const bookDocRef = doc(
                collection(fireStore, firebaseRoute.getAllBookRoute()),
                review.bookId
            );
            const bookDoc = await getDoc(bookDocRef);
            if (bookDoc.exists()) {
                batch.update(bookDocRef, {
                    numberOfReviews: increment(-1),
                });
            }
            batch.delete(reviewDocRef);
            await batch.commit();
            setReviews((prev) => prev.filter((item) => item.id !== review.id));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user) {
            getBookReviews(user.uid);
        }
    }, [user]);

    return (
        <Box>
            <LibrarySection title="Bài đánh giá">
                {loading && <BookSnippetHorizontalSkeleton />}
                {reviews.length <= 0 ? (
                    <Text fontSize={18}>Chưa có bài đánh giá nào</Text>
                ) : (
                    <BookCarousel type="grid" length={getReviewGroup().length}>
                        {getReviewGroup().map((reviewGroup) => (
                            <Box>
                                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                    {reviewGroup.map((review) => (
                                        <ReviewSnippetItem
                                            review={review}
                                            href={getEditBookReviewPage(
                                                review.bookId,
                                                review.id!
                                            )}
                                            onDelete={(review) => {
                                                setConfirmTitle(
                                                    "Xác nhận xóa bài đánh giá"
                                                );
                                                setConfirmContent(
                                                    "Bạn chắc chắn muốn xóa bài đánh giá này?"
                                                );
                                                setConfirmSubmitFunc(
                                                    () => () =>
                                                        handleDeleteReview(
                                                            review
                                                        )
                                                );
                                                toggleView("confirmModal");
                                            }}
                                            onCarousel={true}
                                        />
                                    ))}
                                </Grid>
                            </Box>
                        ))}
                    </BookCarousel>
                )}
            </LibrarySection>
        </Box>
    );
};

export default LibraryReview;
