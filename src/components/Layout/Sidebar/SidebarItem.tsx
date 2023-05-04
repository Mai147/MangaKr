import { FlexProps, Flex, Icon, Link, VStack, Text } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";

interface SidebarItemProps extends FlexProps {
    icon: IconType;
    children: string;
    href?: string;
    subChildren?: {
        name: string;
        href?: string;
    }[];
}

const SidebarItem = ({
    icon,
    children,
    href,
    subChildren,
}: SidebarItemProps) => {
    return (
        <Link
            href={href}
            style={{ textDecoration: "none" }}
            _focus={{ boxShadow: "none" }}
        >
            <Flex direction="column" w="100%" align="flex-start" px="4">
                <Flex
                    w="100%"
                    align="center"
                    p="4"
                    pl={2}
                    borderRadius="lg"
                    role="group"
                    cursor="pointer"
                    _hover={{
                        bg: "brand.400",
                        color: "white",
                    }}
                >
                    {icon && (
                        <Icon
                            mr="4"
                            fontSize="20"
                            _groupHover={{
                                color: "white",
                            }}
                            as={icon}
                        />
                    )}
                    {children}
                </Flex>
                {subChildren?.map((item) => (
                    <Link
                        px={4}
                        pl={10}
                        py={2}
                        borderRadius="lg"
                        w="100%"
                        _hover={{
                            bg: "brand.400",
                            color: "white",
                        }}
                        href={item.href}
                    >
                        <Text>{item.name}</Text>
                    </Link>
                ))}
            </Flex>
        </Link>
    );
};

export default SidebarItem;
