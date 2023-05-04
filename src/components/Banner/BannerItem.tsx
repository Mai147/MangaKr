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
            display="flex"
            flexDirection="column"
            height="100%"
        >
            <Flex
                boxShadow="rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                borderRadius={4}
                bg="white"
                p={{ base: 2, sm: 4 }}
                w="100%"
                direction="column"
                flexGrow={1}
                _hover={{ bg: "gray.50" }}
                transition="all 0.5s"
            >
                <Flex
                    w="100%"
                    border="1px solid"
                    borderColor="gray.100"
                    borderRadius={6}
                    direction={{ base: "column", md: "row" }}
                    align={{ base: "center", sm: "stretch" }}
                    flexGrow={1}
                >
                    <AspectRatio
                        ratio={{ base: 4 / 3, md: 3 / 4 }}
                        w={{
                            base: "100%",
                            md: "100px",
                            lg: "120px",
                            xl: "150px",
                        }}
                        mr={{ base: 0, md: 6 }}
                        flexShrink={0}
                    >
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
                        w="100%"
                    >
                        <VStack spacing={2} align="flex-start">
                            <Text
                                fontSize={{ base: 20, sm: 28, md: 24, xl: 28 }}
                                fontWeight={600}
                                noOfLines={2}
                                lineHeight={1}
                                w="100%"
                                textAlign={{ base: "center", sm: "initial" }}
                            >
                                {book.name}
                            </Text>
                            <Text
                                color="gray.400"
                                noOfLines={3}
                                display={{ base: "none", md: "-webkit-box" }}
                                whiteSpace="pre-line"
                                lineHeight={{ lg: 1.2, xl: "unset" }}
                                fontSize={{ md: 14, xl: 16 }}
                            >
                                {book.description ||
                                    "Manga này chưa có tóm tắt nội dung!"}
                            </Text>
                        </VStack>
                        <BookActionInfoBar book={book} />
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    );
};
export default BannerItem;
