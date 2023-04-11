import InfiniteScroll from "@/components/InfiniteScroll";
import PostItem from "@/components/Post/Item";
import { USER_PAGE_COUNT } from "@/constants/pagination";
import usePost from "@/hooks/usePost";
import usePagination, {
    defaultPaginationInput,
    defaultPaginationOutput,
    FollowPaginationInput,
    PaginationOutput,
} from "@/hooks/usePagination";
import { Follow, UserModel } from "@/models/User";
import { Box, Divider, Flex, Spinner, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsFilePostFill } from "react-icons/bs";
import { RiUserReceivedLine, RiUserShared2Line } from "react-icons/ri";
import TabItem from "../Tab/TabItem";
import ProfileFollowedTab from "./FollowedTab";
import ProfileFollowTab from "./FollowTab";
import ProfileHeader from "./Header";

type ProfileShowProps = {
    user: UserModel;
};

const profileTab = [
    {
        title: "Bài viết",
        icon: BsFilePostFill,
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
    const { postState, postAction } = usePost();
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
        postAction.setSelectedUser(user);
    }, [user]);

    return (
        <Flex
            direction="column"
            align="flex-start"
            bg="white"
            py={6}
            px={12}
            borderRadius={4}
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
                <Flex direction="column" align="center" w="100%" px={12} mt={4}>
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
                                <Box w="100%" mt={8}>
                                    <InfiniteScroll
                                        isLoading={postState.loading.getAll}
                                        page={postState.output.page}
                                        totalPage={postState.output.totalPage}
                                        onNext={postAction.loadMore}
                                    >
                                        {postState.output.list.map(
                                            (postData) => (
                                                <PostItem
                                                    postData={postData}
                                                    key={postData.post.id}
                                                />
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
                        <ProfileFollowedTab user={user} />
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
                        <ProfileFollowTab user={user} />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};
export default ProfileShow;
