import BookSnippetHorizontalSkeleton from "@/components/Book/Snippet/BookSnippetHorizontalSkeleton";
import BookSnippetSkeleton from "@/components/Book/Snippet/BookSnippetSkeleton";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import ReviewSnippetItem from "@/components/Review/Snippet/ReviewSnippetItem";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { getBookReviewDetailPage } from "@/constants/routes";
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
import React, { useEffect, useState } from "react";
import LibrarySection from "../Section";

type LibraryReviewProps = {};

const LibraryReview: React.FC<LibraryReviewProps> = () => {
    const { user } = useAuth();
    const { toggleView } = useModal();
    const [selectedReview, setSelectedReview] = useState<Review>();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);

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
            <ConfirmModal
                title="Xác nhận xóa bài đánh giá"
                content="Bạn chắc chắn muốn xóa bài đánh giá này?"
                onSubmit={() => handleDeleteReview(selectedReview!)}
            />
            <LibrarySection title="Bài đánh giá">
                {loading && <BookSnippetHorizontalSkeleton />}
                {reviews.length <= 0 ? (
                    <Text fontSize={18}>Chưa có bài đánh giá nào</Text>
                ) : (
                    <Grid templateColumns="repeat(2, 1fr)" gap={4} w="100%">
                        {reviews.map((review) => (
                            <GridItem key={review.id}>
                                <ReviewSnippetItem
                                    review={review}
                                    // href={getBookReviewDetailPage(
                                    //     review.bookId,
                                    //     review.id!
                                    // )}
                                    onDelete={(review) => {
                                        setSelectedReview(review);
                                        toggleView("confirmModal");
                                    }}
                                />
                            </GridItem>
                        ))}
                    </Grid>
                )}
            </LibrarySection>
        </Box>
    );
};

export default LibraryReview;
