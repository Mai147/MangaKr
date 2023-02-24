import { BOOK_PAGE, BOOK_TOP_PAGE, getEditBookPage } from "@/constants/routes";
import { Book } from "@/models/Book";
import { Box, Button, Divider, Flex, VStack } from "@chakra-ui/react";
import React from "react";
import BannerItem from "../Banner/BannerItem";
import BookSnippetItem from "../Book/Snippet/BookSnippetItem";
import BookCarousel from "../Book/Snippet/Carousel";
import PageContent from "../Layout/PageContent";
import RightSidebar from "../Layout/Sidebar/RightSidebar";
import SectionHeading from "./SectionHeading";

type HomeProps = {
    bannerBooks: Book[];
    newestMangas: Book[];
    mostPopularMangas: Book[];
};

const Home: React.FC<HomeProps> = ({
    bannerBooks,
    newestMangas,
    mostPopularMangas,
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
                        return (
                            <Box p={4} key={book.id}>
                                <BannerItem book={book} />
                            </Box>
                        );
                    })}
                </BookCarousel>
            </Flex>
            <PageContent>
                <VStack spacing={2} align="flex-start">
                    <SectionHeading title="Manga vừa ra mắt" href={BOOK_PAGE} />
                    <BookCarousel length={newestMangas.length}>
                        {newestMangas.map((book) => (
                            <Box key={book.id}>
                                <Flex direction="column" align="center">
                                    <Flex direction="column" w="95%">
                                        <BookSnippetItem
                                            book={book}
                                            href={`${BOOK_PAGE}/${book.id}`}
                                        />
                                    </Flex>
                                </Flex>
                            </Box>
                        ))}
                    </BookCarousel>
                    <Divider py={4} />
                    <SectionHeading
                        title="Manga nổi bật nhất"
                        href={BOOK_TOP_PAGE}
                    />
                    <BookCarousel length={mostPopularMangas.length}>
                        {mostPopularMangas.map((book) => (
                            <Box key={book.id}>
                                <Flex direction="column" align="center">
                                    <Flex direction="column" w="95%">
                                        <BookSnippetItem
                                            book={book}
                                            href={`${BOOK_PAGE}/${book.id}`}
                                        />
                                    </Flex>
                                </Flex>
                            </Box>
                        ))}
                    </BookCarousel>
                    <SectionHeading
                        title="Manga nổi bật nhất"
                        href={BOOK_TOP_PAGE}
                    />
                    <BookCarousel length={mostPopularMangas.length}>
                        {mostPopularMangas.map((book) => (
                            <Box key={book.id}>
                                <Flex direction="column" align="center">
                                    <Flex direction="column" w="95%">
                                        <BookSnippetItem
                                            book={book}
                                            href={`${BOOK_PAGE}/${book.id}`}
                                        />
                                    </Flex>
                                </Flex>
                            </Box>
                        ))}
                    </BookCarousel>
                    <SectionHeading
                        title="Manga nổi bật nhất"
                        href={BOOK_TOP_PAGE}
                    />
                    <BookCarousel length={mostPopularMangas.length}>
                        {mostPopularMangas.map((book) => (
                            <Box key={book.id}>
                                <Flex direction="column" align="center">
                                    <Flex direction="column" w="95%">
                                        <BookSnippetItem
                                            book={book}
                                            href={`${BOOK_PAGE}/${book.id}`}
                                        />
                                    </Flex>
                                </Flex>
                            </Box>
                        ))}
                    </BookCarousel>
                </VStack>
                <RightSidebar books={bannerBooks} />
            </PageContent>
        </>
    );
};
export default Home;
