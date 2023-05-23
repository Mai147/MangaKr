import { postHeaderList } from "@/components/Community/Approve/CommunityInfoApprove";
import { Book } from "@/models/Book";
import { Box, Flex, HStack, Image, Text } from "@chakra-ui/react";
import React from "react";
import { bookHeaderList } from "./BookApprove";
type BookTableSnippetItemProps = {
    book: Book;
};

const BookTableSnippetItem: React.FC<BookTableSnippetItemProps> = ({
    book,
}) => {
    return (
        <Flex
            justify="space-between"
            align="center"
            w="100%"
            px={{ base: 2, md: 4 }}
            py={4}
            _hover={{ bg: "gray.50" }}
            transition="all 0.3s"
        >
            <HStack spacing={4} flexGrow={1}>
                <Box w={bookHeaderList[0].width} flexShrink={0}>
                    <Image
                        w="100%"
                        src={book.imageUrl || "/images/noImage.jpg"}
                    />
                </Box>
                <Text w={bookHeaderList[1].width} flexShrink={0}>
                    {book.name}
                </Text>
                <Text w={bookHeaderList[2].width} flexGrow={1} noOfLines={3}>
                    {book.description}
                </Text>
            </HStack>
        </Flex>
    );
};
export default BookTableSnippetItem;
