import { SkeletonText, Box } from "@chakra-ui/react";
import React from "react";

type BookSnippetSkeletonProps = {
    loading: boolean;
};

const BookSnippetSkeleton: React.FC<BookSnippetSkeletonProps> = ({
    loading,
}) => {
    return (
        <Box p="6" boxShadow="lg" bg="white" w={"200px"} mr={4}>
            <SkeletonText
                noOfLines={1}
                spacing="4"
                skeletonHeight="40"
                isLoaded={!loading}
                fadeDuration={0.4}
                speed={0.8}
            />
            <SkeletonText
                noOfLines={2}
                mt="4"
                spacing={4}
                skeletonHeight="4"
                isLoaded={!loading}
                fadeDuration={0.4}
                speed={0.8}
            />
        </Box>
    );
};
export default BookSnippetSkeleton;
