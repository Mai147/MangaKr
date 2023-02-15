import { FlexProps, Flex, Icon, Link } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";

interface SidebarItemProps extends FlexProps {
    icon: IconType;
    children: string;
    href?: string;
}

const SidebarItem = ({ icon, children, href }: SidebarItemProps) => {
    return (
        <Link
            href={href}
            style={{ textDecoration: "none" }}
            _focus={{ boxShadow: "none" }}
        >
            <Flex
                align="center"
                p="4"
                pl={2}
                mx="4"
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
        </Link>
    );
};

export default SidebarItem;
