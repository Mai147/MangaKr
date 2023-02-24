import { Book } from "@/models/Book";
import { Flex, Box, Text } from "@chakra-ui/react";
import React from "react";
import BookSnippetItem from "./BookSnippetItem";
import BookSnippetSkeleton from "./BookSnippetSkeleton";
import BookCarousel from "./Carousel";

type BookLibraryCarouselProps = {
    books: Book[];
    loading: boolean;
    onDelete: (book: Book) => void;
    href?: (bookId: string) => string;
    noBookText?: string;
};

const BookLibraryCarousel: React.FC<BookLibraryCarouselProps> = ({
    books,
    loading,
    onDelete,
    href,
    noBookText = "Chưa có manga nào",
}) => {
    return loading ? (
        <Flex>
            {[1, 2, 3].map((idx) => (
                <BookSnippetSkeleton key={idx} loading={loading} />
            ))}
        </Flex>
    ) : books.length <= 0 ? (
        <Text fontSize={18}>{noBookText}</Text>
    ) : (
        <BookCarousel length={books.length} type="librarySnippet">
            {books.map((book) => (
                <Box key={book.id}>
                    <Flex direction="column" align="center">
                        <Flex direction="column" w="95%" py={2}>
                            <BookSnippetItem
                                book={book}
                                href={href && href(book.id!)}
                                onDelete={onDelete}
                            />
                        </Flex>
                    </Flex>
                </Box>
            ))}
        </BookCarousel>
    );
};
export default BookLibraryCarousel;
