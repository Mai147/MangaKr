import { firebaseRoute } from "@/constants/firebaseRoutes";
import { WRITER_ROLE } from "@/constants/roles";
import { AUTHOR_PAGE, COMMUNITY_PAGE } from "@/constants/routes";
import { fireStore } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import { PostNotification } from "@/models/Post";
import { UserCommunitySnippet } from "@/models/User";
import {
    Box,
    Flex,
    IconButton,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Stack,
} from "@chakra-ui/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { AiOutlinePlus, AiOutlineTags } from "react-icons/ai";
import { FiBell } from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";
import NavItem from "../NavItem";
import NotificationItem from "../NotificationItem";
import NavSearch from "./NavSearch";
import NavUser from "./NavUser";

type NavRightContentProps = {};

const NavRightContent: React.FC<NavRightContentProps> = () => {
    const { user } = useAuth();
    const [userNotification, setUserNotification] = useState<
        PostNotification[]
    >([]);

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

    return (
        <Flex align="center">
            <Flex display={{ base: "none", lg: "flex" }} mr={2}>
                <NavSearch />
            </Flex>
            {user && (
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
                            {userNotification.filter((noti) => !noti.isReading)
                                .length > 0 && (
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
                            css={{
                                "&::-webkit-scrollbar": {
                                    width: "4px",
                                },
                                "&::-webkit-scrollbar-track": {
                                    width: "6px",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    background: "#eee",
                                    borderRadius: "24px",
                                },
                            }}
                        >
                            {userNotification.map((noti, idx) => (
                                <NotificationItem
                                    key={noti.id}
                                    userName={noti.creatorDisplayName}
                                    communityName={noti.communityName}
                                    imageUrl={noti.imageUrl}
                                    content="đã đăng 1 bài viết mới trong"
                                    createdAt={noti.createdAt}
                                    href={`${COMMUNITY_PAGE}/${noti.communityId}`}
                                    isLast={idx === userNotification.length - 1}
                                    isReading={noti.isReading}
                                />
                            ))}
                        </Stack>
                    </PopoverContent>
                </Popover>
            )}
            {user && user.role === WRITER_ROLE && (
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
                            <NavItem
                                label="Thêm tác giả"
                                leftIcon={IoPersonOutline}
                                href={`${AUTHOR_PAGE}/create`}
                            />
                            <NavItem
                                label="Thêm thể loại"
                                leftIcon={AiOutlineTags}
                                // href={`${GENRE_PAGE}/create`}
                            />
                            {/* {navItem.children.map((child) => (
                                <NavItem key={child.label} {...child} />
                            ))} */}
                        </Stack>
                    </PopoverContent>
                </Popover>
            )}
            <NavUser />
        </Flex>
    );
};
export default NavRightContent;
