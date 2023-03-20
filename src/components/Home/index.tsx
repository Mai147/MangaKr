import {
    BOOK_PAGE,
    BOOK_REVIEW_PAGE,
    BOOK_TOP_PAGE,
    getEditBookPage,
} from "@/constants/routes";
import { Author } from "@/models/Author";
import { Book } from "@/models/Book";
import { Review } from "@/models/Review";
import {
    Box,
    Button,
    Divider,
    Flex,
    Grid,
    GridItem,
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
import SectionHeading from "./SectionHeading";

type HomeProps = {
    bannerBooks: Book[];
    newestMangas: Book[];
    mostPopularMangas: Book[];
    newestReviews: Review[];
    mostFavoriteAuthors: Author[];
};

const Home: React.FC<HomeProps> = ({
    bannerBooks,
    newestMangas,
    mostPopularMangas,
    newestReviews,
    mostFavoriteAuthors,
}) => {
    return (
        <>
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
            <Divider my={4} borderColor="gray.300" />
            <PageContent>
                <VStack spacing={2} align="flex-start">
                    <SectionHeading title="Manga vừa ra mắt" href={BOOK_PAGE} />
                    <BookCarousel length={newestMangas.length}>
                        {newestMangas.map((book) => (
                            <BookSnippetItem
                                key={book.id}
                                book={book}
                                href={`${BOOK_PAGE}/${book.id}`}
                            />
                        ))}
                    </BookCarousel>
                    <Divider pb={2} />
                    <SectionHeading
                        title="Manga nổi bật nhất"
                        href={BOOK_TOP_PAGE}
                    />
                    <BookCarousel length={mostPopularMangas.length}>
                        {mostPopularMangas.map((book) => (
                            <BookSnippetItem
                                key={book.id}
                                book={book}
                                href={`${BOOK_PAGE}/${book.id}`}
                            />
                        ))}
                    </BookCarousel>
                    <Divider pb={2} />
                    <SectionHeading
                        title="Đánh giá mới nhất"
                        href={BOOK_REVIEW_PAGE}
                    />
                    <BookCarousel length={newestReviews.length} type="banner">
                        {newestReviews.map((review) => (
                            <ReviewSnippetItem
                                key={review.id}
                                review={review}
                                onCarousel={true}
                            />
                        ))}
                    </BookCarousel>
                    <Divider pb={2} />
                    <SectionHeading title="Tác giả nổi bật nhất" />
                    <Box pl={2} ml={"calc(2px - 0.5rem)"} pt={2}>
                        <Grid gridTemplateColumns="repeat(5, 1fr)" gap={4}>
                            {mostFavoriteAuthors.map((author) => (
                                <GridItem key={author.id}>
                                    <AuthorSnippetItem
                                        author={author}
                                        h="100%"
                                    />
                                </GridItem>
                            ))}
                        </Grid>
                    </Box>
                    <Divider pb={2} />

                    {/* <SectionHeading title="Nhân vật yêu thích nhất" />
                    <Box pl={2} ml={"calc(2px - 0.5rem)"} pt={2}>
                        <Grid gridTemplateColumns="repeat(5, 1fr)" gap={4}>
                            {mostFavoriteAuthors.map((author) => (
                                <GridItem key={author.id}>
                                    <AuthorSnippetItem
                                        author={author}
                                        h="100%"
                                    />
                                </GridItem>
                            ))}
                        </Grid>
                    </Box> */}
                </VStack>
                <RightSidebar />
            </PageContent>
        </>
    );
};
export default Home;
