import { WRITER_ROLE } from "@/constants/roles";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import {
    Box,
    CloseButton,
    Divider,
    Flex,
    Image,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";
import { AiOutlinePlus } from "react-icons/ai";
import { BiLibrary } from "react-icons/bi";
import { BsBook } from "react-icons/bs";
import { FiHome } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import NavSearch from "../Navbar/NavRightContent/NavSearch";
import SidebarItem from "./SidebarItem";

interface LinkItemProps {
    name: string;
    icon: IconType;
    href?: string;
    subChildren?: {
        name: string;
        href?: string;
    }[];
}
const LinkItems: Array<LinkItemProps> = [
    { name: "Trang chủ", icon: FiHome, href: routes.getHomePage() },
    {
        name: "Manga",
        icon: BsBook,
        href: routes.getBookHomePage(),
        subChildren: [
            {
                name: "Tìm kiếm Manga",
                href: routes.getBookHomePage(),
            },
            {
                name: "Manga hàng đầu",
                href: routes.getBookTopPage(),
            },
            {
                name: "Reviews",
                href: routes.getReviewHomePage(),
            },
        ],
    },
    {
        name: "Cộng đồng",
        icon: HiOutlineUserGroup,
        href: routes.getCommunityHomePage(),
    },
    { name: "Thư viện", icon: BiLibrary, href: routes.getProfileLibraryPage() },
];

type SidebarProps = {
    onClose: () => void;
};

const Sidebar = ({ onClose }: SidebarProps) => {
    const { toggleView } = useModal();
    const { user } = useAuth();
    return (
        <Box
            transition="width 3s ease"
            bg={useColorModeValue("white", "gray.900")}
            borderRight="1px"
            borderRightColor={useColorModeValue("gray.200", "gray.700")}
            w={{ base: "full", md: 60 }}
            pos="fixed"
            h="full"
            overflow="auto"
            className="scroll"
            pb={10}
        >
            <Flex
                h="20"
                alignItems="center"
                mx="8"
                justifyContent="space-between"
            >
                {/* <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                    Logo
                </Text> */}
                <Image src="/images/logo.png" w="100px" />
                <CloseButton
                    display={{ base: "flex", md: "none" }}
                    onClick={onClose}
                />
            </Flex>
            <Flex direction="column" mx={4} mb={4}>
                <NavSearch />
            </Flex>
            {LinkItems.map((link) => (
                <SidebarItem
                    key={link.name}
                    icon={link.icon}
                    href={link.href}
                    subChildren={link.subChildren}
                >
                    {link.name}
                </SidebarItem>
            ))}
            <Divider my={2} />
            <SidebarItem
                icon={AiOutlinePlus}
                subChildren={[
                    {
                        name: "Tạo cộng đồng",
                        onClick: () => {
                            toggleView("createCommunity");
                        },
                    },
                    {
                        name: "Tạo bài viết",
                        href: routes.getPostCreatePage(),
                    },
                ].concat(
                    user && user.role === WRITER_ROLE
                        ? [
                              {
                                  name: "Thêm tác giả",
                                  href: routes.getAuthorCreatePage(),
                              },
                              {
                                  name: "Thêm thể loại",
                                  href: routes.getGenreCreatePage(),
                              },
                              {
                                  name: "Viết Manga",
                                  href: routes.getBookCreatePage(),
                              },
                          ]
                        : []
                )}
            >
                Tạo
            </SidebarItem>
        </Box>
    );
};

export default Sidebar;
