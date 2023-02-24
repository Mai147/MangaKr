import RatingBar from "@/components/RatingBar";
import { BOOK_PAGE } from "@/constants/routes";
import { Book } from "@/models/Book";
import { Box, Flex, Icon, Link, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";
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
                boxShadow="rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px"
                mb={4}
                _hover={{ bg: "gray.100" }}
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
