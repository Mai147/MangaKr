import InfiniteScroll from "@/components/InfiniteScroll";
import PostItem from "@/components/Post/Item";
import useAuth from "@/hooks/useAuth";
import useNotification from "@/hooks/useNotification";
import usePost from "@/hooks/usePost";
import { UserModel } from "@/models/User";
import { Box, Divider, Flex, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiOutlineShareAlt } from "react-icons/ai";
import { BsFilePostFill } from "react-icons/bs";
import { RiUserReceivedLine, RiUserShared2Line } from "react-icons/ri";
import TabItem from "../Tab/TabItem";
import ProfileFollowedTab from "./FollowedTab";
import ProfileFollowTab from "./FollowTab";
import ProfileHeader from "./Header";
import ProfileSharingPostTab from "./SharingPostTab";

type ProfileShowProps = {
    user: UserModel;
};

const profileTab = [
    {
        title: "Bài viết",
        icon: BsFilePostFill,
    },
    {
        title: "Bài viết đã chia sẻ",
        icon: AiOutlineShareAlt,
    },
    {
        title: "Người theo dõi",
        icon: RiUserReceivedLine,
    },
    {
        title: "Đang theo dõi",
        icon: RiUserShared2Line,
    },
];

const defaultScrollHeight = [
    {
        title: profileTab[0].title,
        height: 0,
    },
    {
        title: profileTab[1].title,
        height: 0,
    },
    {
        title: profileTab[2].title,
        height: 0,
    },
];

const ProfileShow: React.FC<ProfileShowProps> = ({ user }) => {
    const authState = useAuth();
    const { postState, postAction } = usePost();
    const { notificationAction } = useNotification();
    const [selectedTab, setSelectedTab] = useState(profileTab[0].title);
    const [scrollHeight, setScrollHeight] = useState(defaultScrollHeight);

    const onChangeTab = (value: string) => {
        setScrollHeight((prev) =>
            prev.map((item) =>
                item.title !== selectedTab
                    ? item
                    : {
                          ...item,
                          height: document.documentElement.scrollTop,
                      }
            )
        );
        setSelectedTab(value);
        setTimeout(() => {
            window.scrollTo(
                0,
                scrollHeight.find((item) => item.title === value)?.height || 0
            );
        }, 0);
    };

    useEffect(() => {
        if (authState.user) {
            notificationAction.seen(authState.user.uid, user.uid);
        }
    }, [authState.user]);

    return (
        <Flex
            direction="column"
            align="flex-start"
            bg="white"
            py={6}
            px={{ base: 4, md: 12 }}
            borderRadius={{ base: 0, md: 4 }}
            boxShadow="lg"
            flexGrow={1}
        >
            <ProfileHeader user={user} />
            <Divider mt={4} />
            <Flex direction="column" w="100%" justify="center" align="center">
                <Flex
                    width="100%"
                    position="sticky"
                    top={20}
                    left={0}
                    bg="white"
                    zIndex={999}
                    py={2}
                    wrap="wrap"
                >
                    {profileTab.map((item) => (
                        <TabItem
                            key={item.title}
                            item={item}
                            selected={item.title === selectedTab}
                            setSelectedTab={onChangeTab}
                        />
                    ))}
                </Flex>
                <Flex
                    direction="column"
                    align="center"
                    w="100%"
                    px={{ base: 0, md: 12 }}
                    mt={4}
                >
                    <Flex
                        display={
                            selectedTab === profileTab[0].title
                                ? "flex"
                                : "none"
                        }
                        direction="column"
                        align="center"
                        w="100%"
                    >
                        {!postState.loading.getAll &&
                        postState.output.list.length <= 0 ? (
                            <Text>Chưa có bài viết nào</Text>
                        ) : (
                            <>
                                <Box w="100%" mb={8}>
                                    <InfiniteScroll
                                        isLoading={postState.loading.getAll}
                                        page={postState.output.page}
                                        totalPage={postState.output.totalPage}
                                        onNext={postAction.loadMore}
                                    >
                                        {postState.output.list.map(
                                            (postData) => (
                                                <Box
                                                    w="100%"
                                                    mb={10}
                                                    key={postData.post.id}
                                                >
                                                    <PostItem
                                                        key={postData.post.id}
                                                        postData={postData}
                                                        boxShadow={false}
                                                    />
                                                </Box>
                                            )
                                        )}
                                    </InfiniteScroll>
                                </Box>
                                {postState.loading.getAll && <Spinner />}
                            </>
                        )}
                    </Flex>
                    <Flex
                        display={
                            selectedTab === profileTab[1].title
                                ? "flex"
                                : "none"
                        }
                        direction="column"
                        align="center"
                        w="100%"
                    >
                        <ProfileSharingPostTab user={user} />
                    </Flex>
                    <Flex
                        display={
                            selectedTab === profileTab[2].title
                                ? "flex"
                                : "none"
                        }
                        direction="column"
                        align="center"
                        w="100%"
                    >
                        <ProfileFollowedTab user={user} />
                    </Flex>
                    <Flex
                        display={
                            selectedTab === profileTab[3].title
                                ? "flex"
                                : "none"
                        }
                        direction="column"
                        align="center"
                        w="100%"
                    >
                        <ProfileFollowTab user={user} />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};
export default ProfileShow;
