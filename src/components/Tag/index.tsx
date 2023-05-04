import { Box, FlexProps, Link, Text } from "@chakra-ui/react";
import React from "react";

interface TagProps extends FlexProps {
    label: string;
    href?: string;
    isActive?: boolean;
    onClick?: () => void;
}

const Tag: React.FC<TagProps> = ({
    label,
    href,
    isActive,
    onClick,
    ...rest
}) => {
    return (
        <Link
            as={href || onClick ? "a" : "div"}
            _hover={{ textDecoration: "none" }}
            href={href}
            onClick={onClick}
            cursor={href || onClick ? "pointer" : "default"}
        >
            <Box
                {...rest}
                px={{ base: 2, sm: 4 }}
                py={{ base: 1, sm: 1 }}
                minW={20}
                textAlign="center"
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
                <Text fontSize={{ base: 12, sm: 14 }}>{label}</Text>
            </Box>
        </Link>
    );
};

export default Tag;
