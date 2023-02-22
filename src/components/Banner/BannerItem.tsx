import { BOOK_PAGE } from "@/constants/routes";
import { Book } from "@/models/Book";
import {
    AspectRatio,
    Flex,
    Icon,
    Image,
    Link,
    Text,
    VStack,
} from "@chakra-ui/react";
import React from "react";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";
import RatingBar from "../RatingBar";

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
                w="95%"
                p={"24px"}
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
                    <Flex justify="space-between">
                        <Flex align="center">
                            <Text color="gray.600" fontSize={20} mr={2}>
                                {book.rating || 0}/10
                            </Text>
                            <RatingBar
                                rate={book.rating / 2}
                                size={20}
                                readonly
                            />
                        </Flex>
                        <Flex align="center" mx={10}>
                            <Text color="gray.600" fontSize={20} mr={2}>
                                {book.numberOfComments || 0}
                            </Text>
                            <Icon
                                as={FaRegComment}
                                fontSize={24}
                                color="gray.300"
                            />
                        </Flex>
                        <Flex align="center">
                            <Text color="gray.600" fontSize={20} mr={2}>
                                {book.numberOfReviews || 0}
                            </Text>
                            <Icon
                                as={MdOutlineRateReview}
                                fontSize={24}
                                color="gray.300"
                            />
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    );
};
export default BannerItem;
