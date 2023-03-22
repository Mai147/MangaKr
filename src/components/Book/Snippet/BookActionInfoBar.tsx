import RatingBar from "@/components/RatingBar";
import { Book } from "@/models/Book";
import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";

type BookActionInfoBarProps = {
    book: Book;
    textSize?: number;
    iconSize?: number;
};

const BookActionInfoBar: React.FC<BookActionInfoBarProps> = ({
    book,
    iconSize = 20,
    textSize = 20,
}) => {
    return (
        <Flex justify="space-between">
            <Flex align="center">
                <Text color="gray.600" fontSize={textSize} mr={2}>
                    {book.rating || 0}/10
                </Text>
                <RatingBar rate={book.rating / 2} size={textSize} readonly />
            </Flex>
            <Flex align="center" mx={6}>
                <Text color="gray.600" fontSize={textSize} mr={2}>
                    {book.numberOfComments || 0}
                </Text>
                <Icon as={FaRegComment} fontSize={iconSize} color="gray.300" />
            </Flex>
            <Flex align="center">
                <Text color="gray.600" fontSize={textSize} mr={2}>
                    {book.numberOfReviews || 0}
                </Text>
                <Icon
                    as={MdOutlineRateReview}
                    fontSize={iconSize}
                    color="gray.300"
                />
            </Flex>
        </Flex>
    );
};
export default BookActionInfoBar;
