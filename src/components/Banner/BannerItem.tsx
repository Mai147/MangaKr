import { routes } from "@/constants/routes";
import { Book } from "@/models/Book";
import {
    AspectRatio,
    Box,
    Flex,
    Image,
    Link,
    Text,
    VStack,
} from "@chakra-ui/react";
import React from "react";
import BookActionInfoBar from "../Book/Snippet/BookActionInfoBar";

type BannerItemProps = {
    book: Book;
};

const BannerItem: React.FC<BannerItemProps> = ({ book }) => {
    return (
        <Link
            _hover={{ textDecoration: "none" }}
            href={routes.getBookDetailPage(book.id!)}
        >
            <Box
                boxShadow="rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                borderRadius={4}
                bg="white"
                p={4}
                w="100%"
                _hover={{ bg: "gray.50" }}
                transition="all 0.5s"
            >
                <Flex
                    w="100%"
                    border="1px solid"
                    borderColor="gray.100"
                    borderRadius={6}
                >
                    <AspectRatio ratio={3 / 4} w="150px" mr={6} flexShrink={0}>
                        <Image
                            src={book.imageUrl || "/images/noImage.jpg"}
                            objectFit={"cover"}
                            borderRadius={4}
                            alt="Book Image"
                        />
                    </AspectRatio>
                    <Flex
                        direction="column"
                        justify="space-between"
                        flexGrow={1}
                        px={2}
                        py={4}
                    >
                        <VStack spacing={2} align="flex-start">
                            <Text
                                fontSize={28}
                                fontWeight={600}
                                noOfLines={2}
                                lineHeight={1}
                            >
                                {book.name}
                            </Text>
                            <Text
                                color="gray.400"
                                noOfLines={3}
                                whiteSpace="pre-line"
                            >
                                {book.description ||
                                    "Manga này chưa có tóm tắt nội dung!"}
                            </Text>
                        </VStack>
                        <BookActionInfoBar book={book} />
                    </Flex>
                </Flex>
            </Box>
        </Link>
    );
};
export default BannerItem;
