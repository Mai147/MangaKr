import { Box, Link, Text } from "@chakra-ui/react";
import React from "react";

type TagProps = {
    label: string;
    href?: string;
    isActive?: boolean;
    onClick?: () => void;
};

const Tag: React.FC<TagProps> = ({ label, href, isActive, onClick }) => {
    return (
        <Link
            as={href || onClick ? "a" : "div"}
            _hover={{ textDecoration: "none" }}
            href={href}
            onClick={onClick}
            cursor={href || onClick ? "pointer" : "default"}
        >
            <Box
                px={4}
                py={1}
                bg={isActive ? "brand.400" : "gray.300"}
                color={isActive ? "white" : "gray.700"}
                borderRadius={"full"}
                _hover={
                    href || onClick
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
