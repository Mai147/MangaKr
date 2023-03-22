import { Book } from "@/models/Book";
import { Avatar, Box, Flex, Image, Link, Text } from "@chakra-ui/react";
import React, { ReactNode } from "react";

type RightSidebarItemProps = {
    imageUrl?: string;
    imageShape?: "rectangle" | "circle";
    title: string;
    sub?: ReactNode;
    href?: string;
};

const RightSidebarItem: React.FC<RightSidebarItemProps> = ({
    imageUrl,
    imageShape = "rectangle",
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
                {imageShape === "rectangle" ? (
                    <Image
                        src={imageUrl || "/images/noImage.jpg"}
                        width={12}
                        height={16}
                        objectFit="cover"
                        flexShrink={0}
                        mr={2}
                        borderRadius={4}
                    />
                ) : (
                    <Avatar
                        src={imageUrl || "/images/noImage.jpg"}
                        w={12}
                        flexShrink={0}
                        mr={2}
                    />
                )}
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
