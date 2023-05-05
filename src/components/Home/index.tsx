import { routes } from "@/constants/routes";
import useHome from "@/hooks/useHome";
import {
    Box,
    Flex,
    Grid,
    GridItem,
    useBreakpointValue,
    VStack,
} from "@chakra-ui/react";
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
    const bannerLoading = useBreakpointValue({
        base: {
            length: 1,
            arr: [1],
            size: "md",
        },
        md: {
            length: 2,
            arr: [1, 2],
            size: "lg",
        },
    });
    const bookLoading = useBreakpointValue({
        base: {
            length: 2,
            arr: [1, 2],
            size: "md",
        },
        sm: {
            length: 3,
            arr: [1, 2, 3],
            size: "md",
        },
        lg: {
            length: 4,
            arr: [1, 2, 3, 4],
            size: "lg",
        },
    });
    const reviewLoading = useBreakpointValue({
        base: {
            length: 1,
            arr: [1],
            size: "sm",
        },
        md: {
            length: 2,
            arr: [1, 2],
            size: "sm",
        },
    });
    return (
        <>
            {bannerBooks.loading && (
                <Grid
                    templateColumns={`repeat(${
                        bannerLoading?.length || 1
                    }, minmax(0, 1fr))`}
                    gap={4}
                    p={4}
                >
                    {bannerLoading?.arr.map(() => (
                        <HorizontalSkeleton
                            size={(bannerLoading?.size as any) || "md"}
                        />
                    ))}
                </Grid>
            )}
            <Flex direction="column" align="flex-start" p={4}>
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
                <VStack
                    spacing={2}
                    align="flex-start"
                    px={{ base: 4, md: 0 }}
                    pb={4}
                >
                    <VStack spacing={0} align="flex-start" w="100%">
                        <SectionHeading
                            title="Manga vừa ra mắt"
                            href={routes.getBookHomePage()}
                        />
                        {newestMangas.loading && (
                            <Flex>
                                {bookLoading?.arr.map((idx) => (
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
                    </VStack>
                    <VStack spacing={0} align="flex-start" w="100%">
                        <SectionHeading
                            title="Manga nổi bật nhất"
                            href={routes.getBookTopPage()}
                        />
                        {mostPopularMangas.loading && (
                            <Flex>
                                {bookLoading?.arr.map((idx) => (
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
                    </VStack>
                    <VStack spacing={0} align="flex-start" w="100%">
                        <SectionHeading
                            title="Đánh giá mới nhất"
                            href={routes.getReviewHomePage()}
                        />
                        {newestReviews.loading && (
                            <Grid
                                templateColumns={`repeat(${
                                    reviewLoading?.length || 1
                                }, minmax(0, 1fr))`}
                                gap={4}
                                w="100%"
                            >
                                {reviewLoading?.arr.map((item) => (
                                    <HorizontalSkeleton
                                        size={reviewLoading.size as any}
                                        key={item}
                                    />
                                ))}
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
                    </VStack>
                    <VStack spacing={0} align="flex-start" w="100%">
                        <SectionHeading title="Tác giả nổi bật nhất" />
                        {mostFavoriteAuthors.loading && (
                            <Flex>
                                {bannerLoading?.arr.map((idx) => (
                                    <VerticalSkeleton key={idx} />
                                ))}
                            </Flex>
                        )}
                        <Box pt={2} pb={4}>
                            <Grid
                                gridTemplateColumns={{
                                    base: "repeat(1, minmax(0, 1fr))",
                                    sm: "repeat(2, minmax(0, 1fr))",
                                    md: "repeat(3, minmax(0, 1fr))",
                                    lg: "repeat(5, minmax(0, 1fr))",
                                }}
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
                    </VStack>
                    <VStack spacing={0} align="flex-start" w="100%">
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
                </VStack>
                <RightSidebar />
            </PageContent>
        </>
    );
};
export default Home;
