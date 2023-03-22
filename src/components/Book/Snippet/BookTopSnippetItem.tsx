import { BOOK_PAGE } from "@/constants/routes";
import { Book } from "@/models/Book";
import { Box, Flex, Link, Text } from "@chakra-ui/react";
import React from "react";
import SnippetHorizontalImage from "../Image/SnippetHorizontalImage";
import BookActionInfoBar from "./BookActionInfoBar";

type BookTopSnippetItemProps = {
    rank: number;
    book: Book;
};

const BookTopSnippetItem: React.FC<BookTopSnippetItemProps> = ({
    rank,
    book,
}) => {
    return (
        <Link
            href={`${BOOK_PAGE}/${book.id!}`}
            _hover={{ textDecoration: "none" }}
        >
            <Box
                p={4}
                boxShadow="rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                borderRadius={4}
                mb={4}
                bg="white"
                _hover={{ bg: "gray.50" }}
                transition="all 0.5s"
            >
                <Flex align="center">
                    <Flex
                        borderRadius="full"
                        border="1px dashed"
                        borderColor="brand.400"
                        w={8}
                        h={8}
                        fontSize={12}
                        fontWeight={500}
                        align="center"
                        justify="center"
                        flexShrink={0}
                        mr={4}
                    >
                        {rank}
                    </Flex>
                    <SnippetHorizontalImage imageUrl={book.imageUrl} />
                    <Flex
                        direction="column"
                        justify="space-between"
                        align="flex-start"
                        ml={8}
                        alignSelf="stretch"
                    >
                        <Box>
                            <Text noOfLines={1} fontWeight={600}>
                                {book.name}
                            </Text>
                            <Text noOfLines={2} fontSize={14} color="gray.400">
                                {book.description}
                            </Text>
                        </Box>
                        <BookActionInfoBar
                            book={book}
                            textSize={16}
                            iconSize={20}
                        />
                    </Flex>
                </Flex>
            </Box>
        </Link>
    );
};
export default BookTopSnippetItem;
