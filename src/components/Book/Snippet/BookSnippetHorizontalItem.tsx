import { BOOK_PAGE } from "@/constants/routes";
import { Book } from "@/models/Book";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/react";
import React from "react";
import SnippetHorizontalImage from "../Image/SnippetHorizontalImage";
import BookActionInfoBar from "./BookActionInfoBar";

type BookSnippetHorizontalItemProps = {
    book: Book;
};

const BookSnippetHorizontalItem: React.FC<BookSnippetHorizontalItemProps> = ({
    book,
}) => {
    return (
        <Link
            href={`${BOOK_PAGE}/${book.id!}`}
            _hover={{ textDecoration: "none" }}
        >
            <Box
                p={4}
                borderRadius={4}
                boxShadow="rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                // boxShadow="rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
                mb={4}
                _hover={{ bg: "gray.50" }}
                transition="all 0.5s"
            >
                <Flex>
                    <SnippetHorizontalImage imageUrl={book.imageUrl} />
                    <VStack align="flex-start" ml={8} justify="space-between">
                        <Text noOfLines={1} fontWeight={600}>
                            {book.name}
                        </Text>
                        <Text noOfLines={2} fontSize={14} color="gray.500">
                            {book.description ||
                                "Manga này chưa có tóm tắt nội dung"}
                        </Text>
                        <BookActionInfoBar
                            book={book}
                            iconSize={18}
                            textSize={16}
                        />
                    </VStack>
                </Flex>
            </Box>
        </Link>
    );
};
export default BookSnippetHorizontalItem;
