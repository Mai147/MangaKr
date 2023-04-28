import { routes } from "@/constants/routes";
import useHome from "@/hooks/useHome";
import { Box, Flex, Grid, GridItem, VStack } from "@chakra-ui/react";
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
import CircleHorizontalSkeleton from "../Skeleton/CircleHorizontalSkeleton";
import CommunitySnippetHorizontalItem from "../Community/Snippet/CommunitySnippetHorizontalItem";

type HomeProps = {};

const Home: React.FC<HomeProps> = () => {
    const {
        bannerBooks,
        mostFavoriteAuthors,
        mostPopularCommunities,
        mostPopularMangas,
        newestMangas,
        newestReviews,
    } = useHome();
    return (
        <>
            {bannerBooks.loading && (
                <Grid templateColumns="repeat(2, minmax(0, 1fr))" gap={4}>
                    <HorizontalSkeleton size="lg" />
                    <HorizontalSkeleton size="lg" />
                </Grid>
            )}
            <Flex direction="column" align="flex-start">
                <BookCarousel
                    length={bannerBooks.list.length}
                    type="banner"
                    autoplay={true}
                >
                    {bannerBooks.list.map((book) => {
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
                    {newestMangas.loading && (
                        <Flex>
                            {[1, 2, 3].map((idx) => (
                                <VerticalSkeleton key={idx} />
                            ))}
                        </Flex>
                    )}
                    <BookCarousel length={newestMangas.list.length}>
                        {newestMangas.list.map((book) => (
                            <BookSnippetItem
                                key={book.id}
                                book={book}
                                href={routes.getBookDetailPage(book.id!)}
                            />
                        ))}
                    </BookCarousel>
                    <SectionHeading
                        title="Manga nổi bật nhất"
                        href={routes.getBookTopPage()}
                    />
                    {mostPopularMangas.loading && (
                        <Flex>
                            {[1, 2, 3].map((idx) => (
                                <VerticalSkeleton key={idx} />
                            ))}
                        </Flex>
                    )}
                    <BookCarousel length={mostPopularMangas.list.length}>
                        {mostPopularMangas.list.map((book) => (
                            <BookSnippetItem
                                key={book.id}
                                book={book}
                                href={routes.getBookDetailPage(book.id!)}
                            />
                        ))}
                    </BookCarousel>
                    <SectionHeading
                        title="Đánh giá mới nhất"
                        href={routes.getReviewHomePage()}
                    />
                    {newestReviews.loading && (
                        <Grid
                            templateColumns="repeat(2, minmax(0, 1fr))"
                            gap={4}
                            w="100%"
                        >
                            <HorizontalSkeleton size="sm" />
                            <HorizontalSkeleton size="sm" />
                        </Grid>
                    )}
                    <BookCarousel
                        length={newestReviews.list.length}
                        type="banner"
                    >
                        {newestReviews.list.map((review) => (
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
                    <SectionHeading title="Tác giả nổi bật nhất" />
                    {mostFavoriteAuthors.loading && (
                        <Flex>
                            {[1, 2, 3].map((idx) => (
                                <VerticalSkeleton key={idx} />
                            ))}
                        </Flex>
                    )}
                    <Box pt={2} pb={4}>
                        <Grid
                            gridTemplateColumns="repeat(5, minmax(0, 1fr))"
                            gap={4}
                        >
                            {mostFavoriteAuthors.list.map((author) => (
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
                    <SectionHeading title="Cộng đồng yêu thích" />
                    {mostPopularCommunities.loading && (
                        <VStack w="100%">
                            {[1, 2, 3].map((idx) => (
                                <CircleHorizontalSkeleton key={idx} />
                            ))}
                        </VStack>
                    )}
                    <VStack pt={2} w="100%" align="flex-start" spacing={3}>
                        {mostPopularCommunities.list.map((community) => (
                            <Box w="100%" key={community.id}>
                                <CommunitySnippetHorizontalItem
                                    community={community}
                                />
                            </Box>
                        ))}
                    </VStack>
                </VStack>
                <RightSidebar />
            </PageContent>
        </>
    );
};
export default Home;
