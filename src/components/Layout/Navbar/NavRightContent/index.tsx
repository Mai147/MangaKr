import { firebaseRoute } from "@/constants/firebaseRoutes";
import { WRITER_ROLE } from "@/constants/roles";
import { routes } from "@/constants/routes";
import { fireStore } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import { PostNotification } from "@/models/Post";
import { UserCommunitySnippet, UserMessageSnippet } from "@/models/User";
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
import {
    collection,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlinePlus, AiOutlineTags } from "react-icons/ai";
import { BsFillFileEarmarkPostFill } from "react-icons/bs";
import { FiBell, FiBook } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoPersonOutline } from "react-icons/io5";
import { RiChat3Line } from "react-icons/ri";
import NavItem, { NavItemProps } from "../NavItem";
import NotificationItem from "../NotificationItem";
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
    const [userNotification, setUserNotification] = useState<
        PostNotification[]
    >([]);
    const [numberOfNewMessage, setNumberOfNewMessage] = useState(0);

    const getUserCommunityNotification = async (userId: string) => {
        const communityDocsRef = collection(
            fireStore,
            firebaseRoute.getUserCommunitySnippetRoute(userId)
        );
        const communityDoc = await getDocs(communityDocsRef);
        const userCommunities = communityDoc.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as UserCommunitySnippet)
        );
        let notifications: PostNotification[] = [];
        for (const community of userCommunities) {
            const queryConstraints: any[] = [];
            queryConstraints.push(where("id", "==", community.id));
            if (community.latestPost) {
                queryConstraints.push(
                    where("latestPost.id", "!=", community.latestPost.id)
                );
            } else {
                queryConstraints.push(where("latestPost.id", "!=", null));
            }
            const communityNotiQuery = query(
                collection(fireStore, firebaseRoute.getAllCommunityRoute()),
                ...queryConstraints
            );
            const communityDocs = await getDocs(communityNotiQuery);
            if (!communityDocs.empty) {
                notifications = [
                    ...notifications,
                    {
                        ...communityDocs.docs[0].data().latestPost,
                        isReading: false,
                    },
                ];
            } else if (community.latestPost) {
                notifications = [
                    ...notifications,
                    {
                        ...community.latestPost,
                        isReading: true,
                    },
                ];
            }
        }
        notifications.sort((a, b) =>
            a.createdAt.seconds < b.createdAt.seconds ? 1 : -1
        );
        setUserNotification(notifications.filter((item, idx) => idx < 10));
    };

    useEffect(() => {
        if (user) {
            setUserNotification([]);
            getUserCommunityNotification(user.uid);
        }
    }, [user]);

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
            {user && (
                <>
                    <Popover trigger={"hover"} placement={"bottom-start"}>
                        <PopoverTrigger>
                            <Box position="relative">
                                <IconButton
                                    size="lg"
                                    variant="ghost"
                                    aria-label="Notification"
                                    borderRadius="full"
                                    icon={<FiBell />}
                                />
                                {userNotification.filter(
                                    (noti) => !noti.isReading
                                ).length > 0 && (
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
                                        {
                                            userNotification.filter(
                                                (noti) => !noti.isReading
                                            ).length
                                        }
                                    </Flex>
                                )}
                            </Box>
                        </PopoverTrigger>

                        <PopoverContent
                            border={0}
                            minW={"xs"}
                            boxShadow="lg"
                            rounded="xl"
                            overflow="hidden"
                        >
                            <Stack
                                spacing={0}
                                maxH="300px"
                                overflow="auto"
                                className="scroll"
                            >
                                {userNotification.map((noti, idx) => (
                                    <NotificationItem
                                        key={noti.id}
                                        userName={noti.creatorDisplayName}
                                        communityName={noti.communityName}
                                        imageUrl={noti.imageUrl}
                                        content="đã đăng 1 bài viết mới trong"
                                        createdAt={noti.createdAt}
                                        href={routes.getCommunityDetailPage(
                                            noti.communityId
                                        )}
                                        isLast={
                                            idx === userNotification.length - 1
                                        }
                                        isReading={noti.isReading}
                                    />
                                ))}
                            </Stack>
                        </PopoverContent>
                    </Popover>
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
                </>
            )}
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
