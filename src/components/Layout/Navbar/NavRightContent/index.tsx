import { firebaseRoute } from "@/constants/firebaseRoutes";
import { WRITER_ROLE } from "@/constants/roles";
import { routes } from "@/constants/routes";
import { fireStore } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import { UserMessageSnippet } from "@/models/User";
import NotificationService from "@/services/NotificationService";
import {
    Box,
    Flex,
    IconButton,
    Link,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Stack,
} from "@chakra-ui/react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineEdit, AiOutlinePlus, AiOutlineTags } from "react-icons/ai";
import { BsFillFileEarmarkPostFill } from "react-icons/bs";
import { FiBook } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoPersonOutline } from "react-icons/io5";
import { RiChat3Line } from "react-icons/ri";
import NavItem, { NavItemProps } from "../NavItem";
import NavNotification from "./NavNotification";
import NavSearch from "./NavSearch";
import NavUser from "./NavUser";

type NavRightContentProps = {};

const defaultNavList: NavItemProps[] = [
    {
        label: "Tạo cộng đồng",
        leftIcon: HiOutlineUserGroup,
        onClick: () => {},
    },
    {
        label: "Tạo bài viết",
        leftIcon: BsFillFileEarmarkPostFill,
        href: routes.getPostCreatePage(),
    },
];

const writerNavList: NavItemProps[] = [
    {
        label: "Thêm tác giả",
        leftIcon: IoPersonOutline,
        href: routes.getAuthorCreatePage(),
        divider: true,
    },
    {
        label: "Thêm thể loại",
        leftIcon: AiOutlineTags,
        href: routes.getGenreCreatePage(),
    },
    {
        label: "Viết Manga",
        leftIcon: FiBook,
        href: routes.getBookCreatePage(),
    },
    // {
    //     label: "Viết tin tức",
    //     leftIcon: AiOutlineTags,
    //     // href: `${GENRE_PAGE}/create`,
    // },
];

const NavRightContent: React.FC<NavRightContentProps> = () => {
    const { user } = useAuth();
    const { toggleView } = useModal();
    const [numberOfNewMessage, setNumberOfNewMessage] = useState(0);

    useEffect(() => {
        if (user) {
            const q = query(
                collection(
                    fireStore,
                    firebaseRoute.getUserMessageRoute(user.uid)
                ),
                orderBy("latestCreatedAt", "desc")
            );
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                let numberOfNew = 0;
                querySnapshot.docs.forEach((doc) => {
                    const { numberOfUnseens } =
                        doc.data() as UserMessageSnippet;
                    numberOfNew += numberOfUnseens > 0 ? 1 : 0;
                });
                setNumberOfNewMessage(numberOfNew);
            });
            return unsubscribe;
        }
    }, [user]);

    return (
        <Flex align="center">
            <Flex display={{ base: "none", lg: "flex" }} mr={2}>
                <NavSearch />
            </Flex>

            <Popover trigger={"hover"} placement={"bottom-start"}>
                <PopoverTrigger>
                    <IconButton
                        size="lg"
                        variant="ghost"
                        aria-label="add"
                        borderRadius="full"
                        icon={<AiOutlinePlus />}
                    />
                </PopoverTrigger>

                <PopoverContent
                    border={0}
                    boxShadow="md"
                    bg="white"
                    p={4}
                    rounded={"xl"}
                    minW={"xs"}
                >
                    <Stack>
                        {defaultNavList.map((item, idx) => {
                            return (
                                <NavItem
                                    key={item.label}
                                    {...item}
                                    onClick={
                                        idx === 0
                                            ? () =>
                                                  toggleView("createCommunity")
                                            : undefined
                                    }
                                />
                            );
                        })}
                        {user && user.role === WRITER_ROLE && (
                            <>
                                {writerNavList.map((item) => (
                                    <NavItem key={item.label} {...item} />
                                ))}
                            </>
                        )}
                    </Stack>
                </PopoverContent>
            </Popover>
            <NavNotification />
            <Link href={routes.getMessagePage()}>
                <Box position="relative">
                    <IconButton
                        size="lg"
                        variant="ghost"
                        aria-label="Notification"
                        borderRadius="full"
                        icon={<RiChat3Line />}
                    />
                    {numberOfNewMessage > 0 && (
                        <Flex
                            w="4"
                            h="4"
                            rounded="full"
                            bg="red"
                            position="absolute"
                            bottom="2"
                            right="2"
                            color="white"
                            fontSize={10}
                            fontWeight={500}
                            align="center"
                            justify="center"
                        >
                            {numberOfNewMessage <= 99
                                ? numberOfNewMessage
                                : `99+`}
                        </Flex>
                    )}
                </Box>
            </Link>
            {user && user.role === WRITER_ROLE && (
                <Link href={routes.getWriterPage()}>
                    <IconButton
                        size="lg"
                        variant="ghost"
                        aria-label="Edit"
                        borderRadius="full"
                        icon={<AiOutlineEdit />}
                    />
                </Link>
            )}
            <NavUser />
        </Flex>
    );
};
export default NavRightContent;
