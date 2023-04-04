import { Flex, Skeleton, SkeletonText } from "@chakra-ui/react";
import React from "react";

type HorizontalSkeletonProps = {
    size?: "sm" | "md" | "lg";
};

const HorizontalSkeleton: React.FC<HorizontalSkeletonProps> = ({
    size = "md",
}) => {
    return (
        <Flex
            padding={size === "sm" ? 2 : 6}
            boxShadow="xs"
            borderRadius={4}
            bg="white"
            mb={4}
            w="100%"
        >
            <Skeleton
                height={
                    size === "sm" ? "80px" : size === "md" ? "130px" : "200px"
                }
                width={
                    size === "sm" ? "60px" : size === "md" ? "100px" : "150px"
                }
                borderRadius={4}
                mr={size === "sm" ? 4 : 8}
                fadeDuration={0.4}
                speed={1}
            />
            <SkeletonText
                flexGrow={1}
                noOfLines={3}
                spacing={size === "sm" ? 2 : 4}
                skeletonHeight={size === "sm" ? 2 : 4}
                fadeDuration={0.4}
                speed={1}
            />
        </Flex>
    );
};
export default HorizontalSkeleton;
