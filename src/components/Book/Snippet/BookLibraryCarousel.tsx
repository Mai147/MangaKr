import { BookSnippet } from "@/models/Book";
import { Flex, Box, Text } from "@chakra-ui/react";
import React from "react";
import BookSnippetItem from "./BookSnippetItem";
import BookSnippetSkeleton from "./BookSnippetSkeleton";
import BookCarousel from "./Carousel";

type BookLibraryCarouselProps = {
    books: BookSnippet[];
    loading: boolean;
    onDelete: (book: BookSnippet) => void;
    href?: (bookId: string) => string;
    noBookText?: string;
    length: number;
    onPrev?: () => Promise<void>;
    onNext?: () => Promise<void>;
};

const BookLibraryCarousel: React.FC<BookLibraryCarouselProps> = ({
    books,
    loading,
    onDelete,
    href,
    noBookText = "Chưa có manga nào",
    length,
    onNext,
    onPrev,
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
        <BookCarousel
            length={length}
            type="librarySnippet"
            onNext={onNext}
            onPrev={onPrev}
        >
            {books.map((book) => (
                <BookSnippetItem
                    key={book.id}
                    book={book}
                    href={href && href(book.id!)}
                    onDelete={onDelete}
                />
            ))}
        </BookCarousel>
    );
};
export default BookLibraryCarousel;
