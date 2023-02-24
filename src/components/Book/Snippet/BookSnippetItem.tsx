import { Book } from "@/models/Book";
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
    book: Book;
    href?: string;
    onDelete?: (book: Book) => void;
};

const BookSnippetItem: React.FC<BookSnippetItemProps> = ({
    book,
    href,
    onDelete,
}) => {
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
        <Box py={2}>
            <Link href={href} _hover={{ textDecor: "none" }}>
                <Box
                    position="relative"
                    p="4"
                    boxShadow="md"
                    bg="white"
                    borderRadius={4}
                    textAlign="center"
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
                        {book.description ||
                            "Manga này chưa có tóm tắt nội dung!"}
                    </Text>
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
