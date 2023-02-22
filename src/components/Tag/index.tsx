import { Box, Link, Text } from "@chakra-ui/react";
import React from "react";

type TagProps = {
    label: string;
    href?: string;
    isActive?: boolean;
    onClick?: () => void;
    canClick?: boolean;
};

const Tag: React.FC<TagProps> = ({
    label,
    href,
    isActive,
    onClick,
    canClick = true,
}) => {
    return (
        <Link _hover={{ textDecoration: "none" }} href={href} onClick={onClick}>
            <Box
                px={4}
                py={1}
                bg={isActive ? "brand.400" : "gray.300"}
                color={isActive ? "white" : "gray.700"}
                borderRadius={"full"}
                _hover={
                    canClick
                        ? {
                              bg: "brand.700",
                              color: "white",
                          }
                        : {}
                }
                transition="all 0.3s"
            >
                <Text fontSize={14}>{label}</Text>
            </Box>
        </Link>
    );
};
export default Tag;
