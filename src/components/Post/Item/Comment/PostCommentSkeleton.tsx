import { Box, Flex, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import React from "react";

type PostCommentSkeletonProps = {
    width?: string;
};

const PostCommentSkeleton: React.FC<PostCommentSkeletonProps> = ({
    width = "200px",
}) => {
    return (
        <Flex px={2}>
            <SkeletonCircle size="12" mr={2} fadeDuration={0.4} speed={1} />
            <Box w={width} bg="gray.100" borderRadius={8} p={4}>
                <SkeletonText
                    noOfLines={2}
                    spacing="2"
                    skeletonHeight="2"
                    fadeDuration={0.4}
                    speed={1}
                />
            </Box>
        </Flex>
    );
};
export default PostCommentSkeleton;
