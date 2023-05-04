import BookCarousel from "@/components/Book/Snippet/Carousel";
import ReviewSnippetItem from "@/components/Review/Snippet/ReviewSnippetItem";
import HorizontalSkeleton from "@/components/Skeleton/HorizontalSkeleton";
import { routes } from "@/constants/routes";
import { toastOption } from "@/constants/toast";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import { Review } from "@/models/Review";
import ReviewService from "@/services/ReviewService";
import { Box, Grid, Text, useToast } from "@chakra-ui/react";
import React, { SetStateAction, useEffect, useState } from "react";
import LibrarySection from "../Section";

type LibraryReviewProps = {
    setConfirmTitle: React.Dispatch<SetStateAction<string>>;
    setConfirmContent: React.Dispatch<SetStateAction<string>>;
    setConfirmSubContent: React.Dispatch<SetStateAction<string>>;
    setConfirmSubmitFunc: React.Dispatch<
        SetStateAction<() => () => Promise<void>>
    >;
};

const LibraryReview: React.FC<LibraryReviewProps> = ({
    setConfirmContent,
    setConfirmSubContent,
    setConfirmSubmitFunc,
    setConfirmTitle,
}) => {
    const { user } = useAuth();
    const { toggleView, closeModal } = useModal();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

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
            const bookReviews = await ReviewService.getAll({ userId });
            setReviews(bookReviews);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleDeleteReview = async (review: Review) => {
        try {
            await ReviewService.delete({ review });
            setReviews((prev) => prev.filter((item) => item.id !== review.id));
            closeModal();
            toast({
                ...toastOption,
                title: "Xóa thành công!",
                status: "success",
            });
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
                {loading && <HorizontalSkeleton />}
                {reviews.length <= 0 ? (
                    <Text fontSize={18}>Chưa có bài đánh giá nào</Text>
                ) : (
                    <BookCarousel type="grid" length={getReviewGroup().length}>
                        {getReviewGroup().map((reviewGroup, idx) => (
                            <Box key={idx}>
                                <Grid
                                    templateColumns={{
                                        base: "repeat(1, minmax(0, 1fr))",
                                        md: "repeat(2, minmax(0, 1fr))",
                                    }}
                                    gap={2}
                                >
                                    {reviewGroup.map((review) => (
                                        <ReviewSnippetItem
                                            key={review.id}
                                            review={review}
                                            href={routes.getReviewEditPage(
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
                                                setConfirmSubContent("");
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
