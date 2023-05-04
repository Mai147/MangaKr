import { routes } from "@/constants/routes";
import { Book } from "@/models/Book";
import { Box, Flex, Link, Stack, Text, VStack } from "@chakra-ui/react";
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
            href={routes.getBookDetailPage(book.id!)}
            _hover={{ textDecoration: "none" }}
        >
            <Box
                p={{ base: 2, sm: 4 }}
                borderRadius={4}
                boxShadow="rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                bg="white"
                _hover={{ bg: "gray.50" }}
                transition="all 0.5s"
            >
                <Flex align={{ base: "center", md: "stretch" }}>
                    <SnippetHorizontalImage imageUrl={book.imageUrl} />
                    <VStack
                        align="flex-start"
                        ml={{ base: 4, sm: 6, md: 8 }}
                        justify="space-between"
                        w="100%"
                    >
                        <Text noOfLines={1} fontWeight={600}>
                            {book.name}
                        </Text>
                        <Text
                            noOfLines={2}
                            fontSize={14}
                            color="gray.500"
                            whiteSpace="pre-line"
                        >
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
