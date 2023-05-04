import CharacterSnippetItem from "@/components/Character/CharacterSnippetItem";
import ReviewSnippetItem from "@/components/Review/Snippet/ReviewSnippetItem";
import { BOOK_REVIEW_PAGE_COUNT } from "@/constants/pagination";
import { routes } from "@/constants/routes";
import { Book } from "@/models/Book";
import { Review } from "@/models/Review";
import ReviewService from "@/services/ReviewService";
import { Box, Divider, Skeleton, SkeletonText, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import BookCarousel from "../../Snippet/Carousel";
import BookDetailSection from "./Section";

type BookDetailContentProps = {
    book: Book;
};

const BookDetailContent: React.FC<BookDetailContentProps> = ({ book }) => {
    const [bookReviews, setBookReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);

    const getBookReviews = async (bookId: string) => {
        setLoading(true);
        const reviews = await ReviewService.getAll({
            bookId,
            reviewLimit: BOOK_REVIEW_PAGE_COUNT,
        });
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
                children={<Text whiteSpace="pre-line">{book.description}</Text>}
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
                {book.characterSnippets ? (
                    <BookCarousel
                        length={book.characterSnippets?.length}
                        type="characterSnippet"
                    >
                        {book.characterSnippets?.map((char) => (
                            <CharacterSnippetItem
                                key={char.id}
                                character={char}
                            />
                        ))}
                    </BookCarousel>
                ) : (
                    <></>
                )}
            </BookDetailSection>
            <Divider my={4} />
            <BookDetailSection
                title="Bài đánh giá"
                seeMoreHref={
                    bookReviews.length > 0
                        ? routes.getBookReviewHomePage(book.id!)
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
                        <Box key={review.id} my={4}>
                            <ReviewSnippetItem
                                review={review}
                                href={routes.getReviewDetailPage(
                                    review.bookId,
                                    review.id!
                                )}
                            />
                        </Box>
                    ))
                )}
            </BookDetailSection>
        </Box>
    );
};
export default BookDetailContent;
