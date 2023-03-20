import { Book } from "@/models/Book";
import { Box, Flex, Image, Link, Text } from "@chakra-ui/react";
import React, { ReactNode } from "react";

type RightSidebarItemProps = {
    imageUrl?: string;
    title: string;
    sub?: ReactNode;
    href?: string;
};

const RightSidebarItem: React.FC<RightSidebarItemProps> = ({
    imageUrl,
    sub,
    title,
    href,
}) => {
    return (
        <Link href={href} _hover={{ textDecoration: "none" }}>
            <Flex
                p={2}
                width="100%"
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
                transition="all 0.5s"
            >
                <Image
                    src={imageUrl || "/images/noImage.jpg"}
                    width="50px"
                    height="65px"
                    objectFit="cover"
                    flexShrink={0}
                    mr={2}
                    borderRadius={4}
                />
                <Flex direction="column">
                    <Text
                        color="gray.600"
                        fontWeight={600}
                        noOfLines={1}
                        lineHeight={1}
                        mb={2}
                    >
                        {title}
                    </Text>
                    {sub}
                </Flex>
            </Flex>
        </Link>
    );
};
export default RightSidebarItem;
