import { USER_ROLE, WRITER_ROLE } from "@/constants/roles";
import { CREATE_BOOK_PAGE } from "@/constants/routes";
import { auth } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import {
    useColorModeValue,
    Stack,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Box,
    Link,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FiPlus } from "react-icons/fi";
import NavItem, { NavItemProps } from "./NavItem";

type NavListProps = {};

const NavList: React.FC<NavListProps> = () => {
    const linkColor = useColorModeValue("gray.700", "gray.200");
    const linkHoverColor = useColorModeValue("gray.800", "white");
    const popoverContentBgColor = useColorModeValue("white", "gray.800");
    const [navItems, setNavItems] = useState<NavItemProps[]>([]);
    const { user } = useAuth();
    // const [user] = useAuthState(auth);

    useEffect(() => {
        if (user && user.role === WRITER_ROLE) {
            setNavItems([
                {
                    label: "Inspiration",
                    children: [
                        {
                            label: "Explore Design Work",
                            href: "#",
                        },
                        {
                            label: "Top Book",
                            href: "#",
                        },
                        {
                            label: "Create new book",
                            href: CREATE_BOOK_PAGE,
                            leftIcon: FiPlus,
                            divider: true,
                        },
                    ],
                },
                {
                    label: "Find Work",
                    children: [
                        {
                            label: "Job Board",
                            href: "#",
                        },
                        {
                            label: "Freelance Projects",
                            href: "#",
                        },
                    ],
                },
                {
                    label: "Library",
                },
            ]);
        } else {
            setNavItems([
                {
                    label: "Inspiration",
                    children: [
                        {
                            label: "Explore Design Work",
                            href: "#",
                        },
                        {
                            label: "Top Book",
                            href: "#",
                        },
                    ],
                },
                {
                    label: "Find Work",
                    children: [
                        {
                            label: "Job Board",
                            href: "#",
                        },
                        {
                            label: "Freelance Projects",
                            href: "#",
                        },
                    ],
                },
                {
                    label: "Library",
                },
            ]);
        }
    }, [user]);

    return (
        <Stack
            direction={"row"}
            spacing={4}
            display={{ base: "none", lg: "flex" }}
        >
            {navItems.map((navItem) => (
                <Box key={navItem.label}>
                    <Popover trigger={"hover"} placement={"bottom-start"}>
                        <PopoverTrigger>
                            <Link
                                p={2}
                                href={navItem.href ?? "#"}
                                fontSize={"sm"}
                                fontWeight={500}
                                color={linkColor}
                                _hover={{
                                    textDecoration: "none",
                                    color: linkHoverColor,
                                }}
                            >
                                {navItem.label}
                            </Link>
                        </PopoverTrigger>

                        {navItem.children && (
                            <PopoverContent
                                border={0}
                                boxShadow={"xl"}
                                bg={popoverContentBgColor}
                                p={4}
                                rounded={"xl"}
                                minW={"xs"}
                            >
                                <Stack>
                                    {navItem.children.map((child) => (
                                        <NavItem key={child.label} {...child} />
                                    ))}
                                </Stack>
                            </PopoverContent>
                        )}
                    </Popover>
                </Box>
            ))}
        </Stack>
    );
};
export default NavList;
