import { Box, Flex, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import React from "react";

type CircleHorizontalSkeletonProps = {
    size?: "sm" | "md" | "lg";
};

const CircleHorizontalSkeleton: React.FC<CircleHorizontalSkeletonProps> = ({
    size = "md",
}) => {
    return (
        <Box
            padding={size === "sm" ? 2 : 6}
            boxShadow="xs"
            bg="white"
            mb={4}
            w="100%"
        >
            <Flex align="center">
                <SkeletonCircle
                    size={size === "sm" ? "12" : "16"}
                    fadeDuration={0.4}
                    speed={1}
                />
                <Box flexGrow={1} ml={4}>
                    <SkeletonText
                        noOfLines={2}
                        spacing="4"
                        skeletonHeight="2"
                        fadeDuration={0.4}
                        speed={1}
                    />
                </Box>
            </Flex>
        </Box>
    );
};
export default CircleHorizontalSkeleton;
