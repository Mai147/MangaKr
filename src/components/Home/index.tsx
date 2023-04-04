import { routes } from "@/constants/routes";
import useHome from "@/hooks/useHome";
import { Box, Divider, Flex, Grid, GridItem, VStack } from "@chakra-ui/react";
import React from "react";
import AuthorSnippetItem from "../Author/Snippet/AuthorSnippetItem";
import BannerItem from "../Banner/BannerItem";
import BookSnippetItem from "../Book/Snippet/BookSnippetItem";
import BookCarousel from "../Book/Snippet/Carousel";
import PageContent from "../Layout/PageContent";
import RightSidebar from "../Layout/Sidebar/RightSidebar";
import ReviewSnippetItem from "../Review/Snippet/ReviewSnippetItem";
import VerticalSkeleton from "../Skeleton/VerticalSkeleton";
import SectionHeading from "./SectionHeading";
import HorizontalSkeleton from "../Skeleton/HorizontalSkeleton";

type HomeProps = {};

const Home: React.FC<HomeProps> = () => {
    const {
        bannerBooks,
        bannerBooksLoading,
        mostFavoriteAuthors,
        mostFavoriteAuthorsLoading,
        mostPopularMangas,
        mostPopularMangasLoading,
        newestMangas,
        newestMangasLoading,
        newestReviews,
        newestReviewsLoading,
    } = useHome();
    return (
        <>
            {bannerBooksLoading && (
                <Grid templateColumns="repeat(2, minmax(0, 1fr))" gap={4}>
                    <HorizontalSkeleton size="lg" />
                    <HorizontalSkeleton size="lg" />
                </Grid>
            )}
            <Flex direction="column" align="flex-start">
                <BookCarousel
                    length={bannerBooks.length}
                    type="banner"
                    autoplay={true}
                >
                    {bannerBooks.map((book) => {
                        return <BannerItem book={book} key={book.id} />;
                    })}
                </BookCarousel>
            </Flex>
            <PageContent>
                <VStack spacing={2} align="flex-start">
                    <SectionHeading
                        title="Manga vừa ra mắt"
                        href={routes.getBookHomePage()}
                    />
                    {newestMangasLoading && (
                        <Flex>
                            {[1, 2, 3].map((idx) => (
                                <VerticalSkeleton key={idx} />
                            ))}
                        </Flex>
                    )}
                    <BookCarousel length={newestMangas.length}>
                        {newestMangas.map((book) => (
                            <BookSnippetItem
                                key={book.id}
                                book={book}
                                href={routes.getBookDetailPage(book.id!)}
                            />
                        ))}
                    </BookCarousel>
                    <Divider pb={2} />
                    <SectionHeading
                        title="Manga nổi bật nhất"
                        href={routes.getBookTopPage()}
                    />
                    {mostPopularMangasLoading && (
                        <Flex>
                            {[1, 2, 3].map((idx) => (
                                <VerticalSkeleton key={idx} />
                            ))}
                        </Flex>
                    )}
                    <BookCarousel length={mostPopularMangas.length}>
                        {mostPopularMangas.map((book) => (
                            <BookSnippetItem
                                key={book.id}
                                book={book}
                                href={routes.getBookDetailPage(book.id!)}
                            />
                        ))}
                    </BookCarousel>
                    <Divider pb={2} />
                    <SectionHeading
                        title="Đánh giá mới nhất"
                        href={routes.getReviewHomePage()}
                    />
                    {newestReviewsLoading && (
                        <Grid
                            templateColumns="repeat(2, minmax(0, 1fr))"
                            gap={4}
                            w="100%"
                        >
                            <HorizontalSkeleton size="sm" />
                            <HorizontalSkeleton size="sm" />
                        </Grid>
                    )}
                    <BookCarousel length={newestReviews.length} type="banner">
                        {newestReviews.map((review) => (
                            <ReviewSnippetItem
                                key={review.id}
                                review={review}
                                onCarousel={true}
                                href={`${routes.getReviewDetailPage(
                                    review.bookId,
                                    review.id!
                                )}`}
                            />
                        ))}
                    </BookCarousel>
                    <Divider pb={2} />
                    <SectionHeading title="Tác giả nổi bật nhất" />
                    {mostFavoriteAuthorsLoading && (
                        <Flex>
                            {[1, 2, 3].map((idx) => (
                                <VerticalSkeleton key={idx} />
                            ))}
                        </Flex>
                    )}
                    <Box pl={2} ml={"calc(2px - 0.5rem)"} pt={2}>
                        <Grid
                            gridTemplateColumns="repeat(5, minmax(0, 1fr))"
                            gap={4}
                        >
                            {mostFavoriteAuthors.map((author) => (
                                <GridItem key={author.id}>
                                    <AuthorSnippetItem
                                        author={author}
                                        href={routes.getAuthorDetailPage(
                                            author.id!
                                        )}
                                        h="100%"
                                    />
                                </GridItem>
                            ))}
                        </Grid>
                    </Box>
                    <Divider pb={2} />
                </VStack>
                <RightSidebar />
            </PageContent>
        </>
    );
};
export default Home;
