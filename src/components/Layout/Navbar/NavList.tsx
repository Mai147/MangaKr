import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import {
    useColorModeValue,
    Stack,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Box,
    Link,
} from "@chakra-ui/react";
import React, { useState } from "react";
import NavItem, { NavItemProps } from "./NavItem";

type NavListProps = {};

const defaultNavList: NavItemProps[] = [
    {
        label: "Manga",
        href: routes.getBookHomePage(),
        children: [
            {
                label: "Tìm kiếm manga",
                href: routes.getBookHomePage(),
            },
            {
                label: "Manga hàng đầu",
                href: routes.getBookTopPage(),
            },
            {
                label: "Reviews",
                href: routes.getReviewHomePage(),
            },
        ],
    },
    {
        label: "Tin tức",
        href: routes.getNewsHomePage(),
    },
    {
        label: "Cộng đồng",
        href: routes.getCommunityHomePage(),
    },
    {
        label: "Thư viện",
        href: routes.getProfileLibraryPage(),
    },
];

const NavList: React.FC<NavListProps> = () => {
    const { toggleView } = useModal();
    const linkColor = useColorModeValue("gray.700", "gray.200");
    const linkHoverColor = useColorModeValue("gray.800", "white");
    const popoverContentBgColor = useColorModeValue("white", "gray.800");
    const [navItems, setNavItems] = useState<NavItemProps[]>(defaultNavList);
    const { user } = useAuth();

    // useEffect(() => {
    //     if (user && user.role === WRITER_ROLE) {
    //         setNavItems(writerNavList);
    //     } else {
    //         setNavItems(defaultNavList);
    //     }
    // }, [user]);

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
                                href={navItem.href}
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
