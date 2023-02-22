import {
    Box,
    Flex,
    Skeleton,
    SkeletonCircle,
    SkeletonText,
} from "@chakra-ui/react";
import React from "react";

type BookSnippetHorizontalSkeletonProps = {};

const BookSnippetHorizontalSkeleton: React.FC<
    BookSnippetHorizontalSkeletonProps
> = () => {
    return (
        <Flex padding="6" boxShadow="lg" bg="white" mb={4}>
            <Skeleton
                height="130px"
                width="100px"
                borderRadius={4}
                mr={8}
                speed={1}
            />
            <SkeletonText
                flexGrow={1}
                noOfLines={2}
                mt="4"
                spacing={4}
                skeletonHeight="4"
                fadeDuration={0.4}
                speed={1}
            />
        </Flex>
    );
};
export default BookSnippetHorizontalSkeleton;
