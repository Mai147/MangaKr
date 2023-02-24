import { Review } from "@/models/Review";
import { Flex, Icon, Text } from "@chakra-ui/react";
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
        <Flex>
            <Flex align="center" color="gray.500" mx={10}>
                <Text fontSize={24}>{review.numberOfLikes}</Text>
                <Icon as={BiLike} ml={1} fontSize={24} />
            </Flex>
            <Flex align="center" color="gray.500" mx={10}>
                <Text fontSize={24}>{review.numberOfDislikes}</Text>
                <Icon as={BiDislike} ml={1} fontSize={24} />
            </Flex>
            <Flex align="center" color="gray.500" mx={10}>
                <Text fontSize={24}>{review.numberOfComments}</Text>
                <Icon as={FaRegComment} ml={1} fontSize={24} />
            </Flex>
        </Flex>
    );
};
export default ReviewActionInfoBar;
