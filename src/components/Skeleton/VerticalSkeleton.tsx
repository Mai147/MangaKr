import { SkeletonText, Box } from "@chakra-ui/react";
import React from "react";

type VerticalSkeletonProps = {
    size?: "sm" | "md" | "lg";
};

const VerticalSkeleton: React.FC<VerticalSkeletonProps> = ({ size }) => {
    return (
        <Box
            p={{ base: 2, sm: 4, md: 6 }}
            boxShadow="lg"
            bg="white"
            w={{ base: "100px", sm: "150px", md: "200px" }}
            mr={4}
        >
            <SkeletonText
                noOfLines={1}
                spacing="4"
                skeletonHeight={{ base: 28, sm: 32, md: 40 }}
                fadeDuration={0.4}
                speed={0.8}
            />
            <SkeletonText
                noOfLines={2}
                mt="4"
                spacing={{ base: 2, md: 4 }}
                skeletonHeight={{ base: 2, md: 4 }}
                fadeDuration={0.4}
                speed={0.8}
            />
        </Box>
    );
};
export default VerticalSkeleton;
