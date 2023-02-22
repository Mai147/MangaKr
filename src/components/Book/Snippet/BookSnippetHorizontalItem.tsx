import { BOOK_PAGE } from "@/constants/routes";
import { BookSnippet } from "@/models/Book";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/react";
import React from "react";
import SnippetHorizontalImage from "../Image/SnippetHorizontalImage";

type BookSnippetHorizontalItemProps = {
    book: BookSnippet;
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
                boxShadow="rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px"
                mb={4}
            >
                <Flex>
                    <SnippetHorizontalImage imageUrl={book.imageUrl} />
                    <VStack align="flex-start" ml={8}>
                        <Text noOfLines={1} fontWeight={600}>
                            {book.name}
                        </Text>
                        <Text noOfLines={3} fontSize={14} color="gray.400">
                            {book.description}
                        </Text>
                    </VStack>
                </Flex>
            </Box>
        </Link>
    );
};
export default BookSnippetHorizontalItem;
