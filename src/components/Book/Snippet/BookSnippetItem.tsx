import { BookSnippet } from "@/models/Book";
import {
    AspectRatio,
    Box,
    Image,
    Link,
    Text,
    useBreakpointValue,
} from "@chakra-ui/react";
import React from "react";

type BookSnippetItemProps = {
    book: BookSnippet;
    href?: string;
};

const BookSnippetItem: React.FC<BookSnippetItemProps> = ({ book, href }) => {
    const nameLines = useBreakpointValue({ base: 1, md: 2, lg: 1, xl: 2 });
    const nameHeight = useBreakpointValue({
        base: "28px",
        md: "56px",
        lg: "28px",
        xl: "56px",
    });
    const descriptionLines = useBreakpointValue({
        base: 2,
        md: 3,
        lg: 2,
        xl: 3,
    });
    const descriptionHeight = useBreakpointValue({
        base: "40px",
        md: "60px",
        lg: "40px",
        xl: "60px",
    });
    return (
        <Link href={href} _hover={{ textDecor: "none" }}>
            <Box
                p="4"
                boxShadow="lg"
                bg="white"
                borderRadius={4}
                textAlign="center"
                // w="100%"
                // w={{
                //     base: "240px",
                //     sm: "170px",
                //     md: "250px",
                //     lg: "200px",
                //     xl: "260px",
                // }}
                _hover={{ transform: "scale(1.03)", bg: "gray.100" }}
                transition="all 0.3s"
            >
                <AspectRatio ratio={3 / 4}>
                    <Image
                        src={book.imageUrl || "/images/noImage.jpg"}
                        objectFit={"cover"}
                        borderRadius={4}
                        alt="Book Image"
                    />
                </AspectRatio>
                <Text
                    fontSize={{ base: 16, md: 18 }}
                    fontWeight={600}
                    noOfLines={nameLines}
                    mt={4}
                    height={nameHeight}
                >
                    {book.name}
                </Text>
                <Text
                    fontSize={{ base: 12, md: 14 }}
                    color="gray.400"
                    noOfLines={descriptionLines}
                    height={descriptionHeight}
                >
                    {book.description || "Manga này chưa có tóm tắt nội dung!"}
                </Text>
            </Box>
        </Link>
    );
};
export default BookSnippetItem;
