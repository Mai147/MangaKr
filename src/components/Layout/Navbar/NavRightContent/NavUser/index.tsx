import {
    Flex,
    Menu,
    MenuButton,
    HStack,
    Avatar,
    MenuList,
    useColorModeValue,
    MenuDivider,
    Box,
    Text,
    IconButton,
} from "@chakra-ui/react";
import React from "react";
import { FiChevronDown, FiLogIn, FiLogOut, FiUser } from "react-icons/fi";
import { BiLibrary, BiRegistered } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { TiEdit } from "react-icons/ti";
import { auth } from "@/firebase/clientApp";
import AuthButtons from "./AuthButtons";
import NavUserMenuItem from "./NavUserMenuItem";
import useModal from "@/hooks/useModal";
import { signOut } from "firebase/auth";
import useAuth from "@/hooks/useAuth";
import { routes } from "@/constants/routes";
import { RiChat3Line } from "react-icons/ri";
import { WRITER_ROLE } from "@/constants/roles";
import { AiOutlineEdit } from "react-icons/ai";

type NavUserProps = {};

const NavUser: React.FC<NavUserProps> = () => {
    const { toggleView } = useModal();
    const { user, authAction } = useAuth();

    const navUserList = [
        {
            icon: TiEdit,
            title: "Hồ sơ",
            href: routes.getProfileEditPage(),
        },
        {
            icon: CgProfile,
            title: "Trang cá nhân",
            href: routes.getProfilePage(user?.uid!),
        },
        {
            icon: BiLibrary,
            title: "Thư viện",
            href: routes.getProfileLibraryPage(),
        },
    ];

    const mobileNavList = [
        {
            icon: RiChat3Line,
            title: "Tin nhắn",
            href: routes.getMessagePage(),
        },
    ];

    return (
        <Flex alignItems={"center"} ml={2}>
            {user ? (
                <Menu>
                    <MenuButton
                        py={2}
                        transition="all 0.3s"
                        w="100%"
                        _focus={{ boxShadow: "none" }}
                    >
                        <HStack justify="space-between">
                            <HStack>
                                <Avatar
                                    size={"sm"}
                                    src={user.photoURL || ""}
                                    referrerPolicy="no-referrer"
                                />
                                <Text
                                    fontSize="sm"
                                    display={{ base: "none", md: "unset" }}
                                >
                                    {user.displayName}
                                </Text>
                            </HStack>
                            <Box display={{ base: "none", md: "flex" }}>
                                <FiChevronDown />
                            </Box>
                        </HStack>
                    </MenuButton>
                    <MenuList
                        bg={useColorModeValue("white", "gray.900")}
                        borderColor={useColorModeValue("gray.200", "gray.700")}
                    >
                        {navUserList.map((item) => (
                            <NavUserMenuItem
                                icon={item.icon}
                                title={item.title}
                                href={item.href}
                                key={item.title}
                            />
                        ))}
                        <MenuDivider display={{ base: "block", sm: "none" }} />
                        <Box display={{ base: "block", sm: "none" }}>
                            {mobileNavList.map((item) => (
                                <NavUserMenuItem
                                    icon={item.icon}
                                    title={item.title}
                                    href={item.href}
                                    key={item.title}
                                />
                            ))}
                            {user && user.role === WRITER_ROLE && (
                                <NavUserMenuItem
                                    icon={AiOutlineEdit}
                                    title="Quản lý Manga"
                                    href={routes.getWriterPage()}
                                />
                            )}
                        </Box>
                        <MenuDivider />
                        <NavUserMenuItem
                            icon={FiLogOut}
                            title="Đăng xuất"
                            onClick={async () => {
                                await authAction.logout();
                                await signOut(auth);
                            }}
                        />
                    </MenuList>
                </Menu>
            ) : (
                <Flex alignItems="center">
                    <Box display={{ base: "none", md: "flex" }}>
                        <AuthButtons />
                    </Box>
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            display={{ base: "flex", md: "none" }}
                            size="lg"
                            variant="ghost"
                            aria-label="open menu"
                            icon={<FiUser />}
                        ></MenuButton>
                        <MenuList
                            bg={useColorModeValue("white", "gray.900")}
                            borderColor={useColorModeValue(
                                "gray.200",
                                "gray.700"
                            )}
                        >
                            <NavUserMenuItem
                                icon={FiLogIn}
                                title="Đăng nhập"
                                onClick={(event: React.MouseEvent) => {
                                    event.preventDefault();
                                    toggleView("login");
                                }}
                            />
                            <NavUserMenuItem
                                icon={BiRegistered}
                                title="Đăng ký"
                                onClick={(event: React.MouseEvent) => {
                                    event.preventDefault();
                                    toggleView("signup");
                                }}
                            />
                        </MenuList>
                    </Menu>
                </Flex>
            )}
        </Flex>
    );
};
export default NavUser;
