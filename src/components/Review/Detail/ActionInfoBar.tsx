import { Review } from "@/models/Review";
import { Flex, HStack, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { BiLike, BiDislike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";

type ReviewActionInfoBarProps = {
    review: Review;
};

const ReviewActionInfoBar: React.FC<ReviewActionInfoBarProps> = ({
    review,
}) => {
    return (
        <HStack spacing={{ base: 4, md: 10 }}>
            <Flex align="center" color="gray.500">
                <Text fontSize={{ base: 18, md: 24 }}>
                    {review.numberOfLikes}
                </Text>
                <Icon as={BiLike} ml={1} fontSize={{ base: 18, md: 24 }} />
            </Flex>
            <Flex align="center" color="gray.500">
                <Text fontSize={{ base: 18, md: 24 }}>
                    {review.numberOfDislikes}
                </Text>
                <Icon as={BiDislike} ml={1} fontSize={{ base: 18, md: 24 }} />
            </Flex>
            <Flex align="center" color="gray.500">
                <Text fontSize={{ base: 18, md: 24 }}>
                    {review.numberOfComments}
                </Text>
                <Icon
                    as={FaRegComment}
                    ml={1}
                    fontSize={{ base: 18, md: 24 }}
                />
            </Flex>
        </HStack>
    );
};
export default ReviewActionInfoBar;
