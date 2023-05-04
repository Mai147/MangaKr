import { BookSnippet } from "@/models/Book";
import {
    AspectRatio,
    Box,
    IconButton,
    Image,
    Link,
    Text,
    useBreakpointValue,
} from "@chakra-ui/react";
import React from "react";
import { FaTimes } from "react-icons/fa";

type BookSnippetItemProps = {
    book: BookSnippet;
    href?: string;
    onDelete?: (book: BookSnippet) => void;
};

const BookSnippetItem: React.FC<BookSnippetItemProps> = ({
    book,
    href,
    onDelete,
}) => {
    const nameLines = useBreakpointValue({ base: 1, md: 2, lg: 1, xl: 2 });
    const nameHeight = useBreakpointValue({
        base: "25px",
        md: "50px",
        lg: "25px",
        xl: "50px",
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
        <Box py={2}>
            <Link href={href} _hover={{ textDecor: "none" }}>
                <Box
                    position="relative"
                    boxShadow="rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                    bg="white"
                    borderRadius={4}
                    _hover={{ transform: "scale(1.02)", bg: "gray.50" }}
                    transition="all 0.3s"
                >
                    <AspectRatio ratio={{ base: 4 / 3, sm: 1 }}>
                        <Image
                            src={book.imageUrl || "/images/noImage.jpg"}
                            objectFit={"cover"}
                            borderRadius={4}
                            alt="Book Image"
                            w="100%"
                        />
                    </AspectRatio>
                    <Box px="4" pb={4}>
                        <Text
                            fontSize={{ base: 16, md: 18 }}
                            fontWeight={600}
                            noOfLines={nameLines}
                            mt={4}
                            height={nameHeight}
                            lineHeight={1.2}
                        >
                            {book.name}
                        </Text>
                        <Text
                            fontSize={14}
                            color="gray.400"
                            noOfLines={descriptionLines}
                            height={descriptionHeight}
                            whiteSpace="pre-line"
                        >
                            {book.description ||
                                "Manga này chưa có tóm tắt nội dung!"}
                        </Text>
                    </Box>
                    {onDelete && (
                        <IconButton
                            position="absolute"
                            top={2}
                            right={2}
                            size="sm"
                            aria-label="Delete button"
                            bg="brand.400"
                            borderRadius="full"
                            icon={<FaTimes />}
                            _hover={{ bg: "brand.100" }}
                            transition="all 0.3s"
                            onClick={(event) => {
                                event.stopPropagation();
                                event.nativeEvent.preventDefault();
                                onDelete(book);
                            }}
                        />
                    )}
                </Box>
            </Link>
        </Box>
    );
};
export default BookSnippetItem;
