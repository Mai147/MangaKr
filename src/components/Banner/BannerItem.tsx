import { BOOK_PAGE } from "@/constants/routes";
import { Book } from "@/models/Book";
import { AspectRatio, Flex, Image, Link, Text, VStack } from "@chakra-ui/react";
import React from "react";
import BookActionInfoBar from "../Book/Snippet/BookActionInfoBar";

type BannerItemProps = {
    book: Book;
};

const BannerItem: React.FC<BannerItemProps> = ({ book }) => {
    return (
        <Link
            _hover={{ textDecoration: "none" }}
            href={`${BOOK_PAGE}/${book.id}`}
        >
            <Flex
                boxShadow="md"
                w="100%"
                p={4}
                borderRadius={4}
                _hover={{ bg: "gray.100" }}
                transition="all 0.3s"
            >
                <AspectRatio ratio={3 / 4} w="150px" mr={10} flexShrink={0}>
                    <Image
                        src={book.imageUrl || "/images/noImage.jpg"}
                        objectFit={"cover"}
                        borderRadius={4}
                        alt="Book Image"
                    />
                </AspectRatio>
                <Flex direction="column" justify="space-between" flexGrow={1}>
                    <VStack spacing={2} align="flex-start">
                        <Text fontSize={28} fontWeight={600} noOfLines={2}>
                            {book.name}
                        </Text>
                        <Text color="gray.400" noOfLines={3}>
                            {book.description ||
                                "Manga này chưa có tóm tắt nội dung!"}
                        </Text>
                    </VStack>
                    <BookActionInfoBar book={book} />
                </Flex>
            </Flex>
        </Link>
    );
};
export default BannerItem;
