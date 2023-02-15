import { Stack, Box, Text, Flex, Icon, Divider, Link } from "@chakra-ui/react";
// import Link from 'next/link';
import React from "react";
import { IconType } from "react-icons";
import { BsChevronRight } from "react-icons/bs";

export type NavItemProps = {
    label: string;
    subLabel?: string;
    children?: Array<NavItemProps>;
    href?: string;
    leftIcon?: IconType;
    divider?: boolean;
};

const NavItem: React.FC<NavItemProps> = ({
    label,
    href,
    subLabel,
    leftIcon,
    divider,
}) => {
    return (
        <Flex direction="column">
            {divider && <Divider />}
            <Link
                href={href}
                role={"group"}
                display={"block"}
                p={2}
                rounded={"md"}
                _hover={{ decoration: "none" }}
            >
                <Stack direction={"row"} align={"center"}>
                    {leftIcon && <Icon as={leftIcon} />}
                    <Box>
                        <Text transition={"all .3s ease"} fontWeight={500}>
                            {label}
                        </Text>
                        <Text fontSize={"sm"}>{subLabel}</Text>
                    </Box>
                    <Flex
                        transition={"all .3s ease"}
                        transform={"translateX(-10px)"}
                        opacity={0}
                        _groupHover={{
                            opacity: "100%",
                            transform: "translateX(0)",
                        }}
                        justify={"flex-end"}
                        align={"center"}
                        flex={1}
                    >
                        <Icon
                            color={"brand.100"}
                            w={5}
                            h={5}
                            as={BsChevronRight}
                        />
                    </Flex>
                </Stack>
            </Link>
        </Flex>
    );
};

export default NavItem;
