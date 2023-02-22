import { WRITER_ROLE } from "@/constants/roles";
import {
    BOOK_PAGE,
    BOOK_REVIEW_PAGE,
    BOOK_TOP_PAGE,
    COMMUNITY_PAGE,
    CREATE_BOOK_PAGE,
    CREATE_NEWS_PAGE,
    NEWS_PAGE,
    PROFILE_LIBRARY_PAGE,
} from "@/constants/routes";
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
import { FiPlus } from "react-icons/fi";
import NavItem, { NavItemProps } from "./NavItem";

type NavListProps = {};

const defaultNavList: NavItemProps[] = [
    {
        label: "Manga",
        href: BOOK_PAGE,
        children: [
            {
                label: "Tìm kiếm manga",
                href: BOOK_PAGE,
            },
            {
                label: "Manga hàng đầu",
                href: BOOK_TOP_PAGE,
            },
            {
                label: "Reviews",
                href: BOOK_REVIEW_PAGE,
            },
        ],
    },
    {
        label: "Tin tức",
        href: NEWS_PAGE,
    },
    {
        label: "Cộng đồng",
        href: COMMUNITY_PAGE,
    },
    {
        label: "Thư viện",
        href: PROFILE_LIBRARY_PAGE,
    },
];

const writerNavList: NavItemProps[] = [
    {
        ...defaultNavList[0],
        children: [
            ...defaultNavList[0].children!,
            {
                label: "Viết Manga",
                href: CREATE_BOOK_PAGE,
                leftIcon: FiPlus,
                divider: true,
            },
        ],
    },
    {
        ...defaultNavList[1],
        children: [
            {
                label: "Viết tin tức",
                href: CREATE_NEWS_PAGE,
                leftIcon: FiPlus,
            },
        ],
    },
    ...defaultNavList.slice(2),
];

const NavList: React.FC<NavListProps> = () => {
    const linkColor = useColorModeValue("gray.700", "gray.200");
    const linkHoverColor = useColorModeValue("gray.800", "white");
    const popoverContentBgColor = useColorModeValue("white", "gray.800");
    const [navItems, setNavItems] = useState<NavItemProps[]>(defaultNavList);
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.role === WRITER_ROLE) {
            setNavItems(writerNavList);
        } else {
            setNavItems(defaultNavList);
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
