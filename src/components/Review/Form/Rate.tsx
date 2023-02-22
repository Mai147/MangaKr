import ErrorText from "@/components/Modal/Auth/ErrorText";
import RatingBar from "@/components/RatingBar";
import Tag from "@/components/Tag";
import { ValidationError } from "@/constants/validation";
import { TagReview, tagReviewList } from "@/models/Review";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import React from "react";

type ReviewFormRateProps = {
    rating: number;
    tagReview: TagReview;
    setRating: (value: number) => void;
    setTagReview: (value: TagReview) => void;
    errors: ValidationError[];
};

const ReviewFormRate: React.FC<ReviewFormRateProps> = ({
    rating,
    tagReview,
    setRating,
    setTagReview,
    errors,
}) => {
    return (
        <VStack
            border="1px solid"
            borderColor="gray.400"
            w="100%"
            p={6}
            borderRadius={4}
            spacing={4}
            align="flex-start"
        >
            <Flex>
                <Text w={28}>Điểm</Text>
                <RatingBar rate={rating} maxRate={10} setRate={setRating} />
            </Flex>
            <Flex>
                <Text w={28}>Đánh giá</Text>
                <VStack align="flex-start">
                    <Flex>
                        {tagReviewList.map((tag) => (
                            <Box mr={2} key={tag.value}>
                                <Tag
                                    label={tag.label}
                                    isActive={tag.value === tagReview}
                                    onClick={() => setTagReview(tag.value)}
                                />
                            </Box>
                        ))}
                    </Flex>
                    <ErrorText
                        error={
                            errors.find((err) => err.field === "tagReview")
                                ?.message
                        }
                    />
                </VStack>
            </Flex>
        </VStack>
    );
};
export default ReviewFormRate;
