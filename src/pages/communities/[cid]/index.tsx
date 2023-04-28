import CommunityHeader from "@/components/Community/Header";
import CommunityLeftSideBar from "@/components/Community/LeftSideBar";
import CommunityPostTab from "@/components/Community/PostTab";
import CommunityTopicTab from "@/components/Community/TopicTab";
import CommunityVotingTab from "@/components/Community/VotingTab";
import NotAvailable from "@/components/Error/NotAvailable";
import TabItem from "@/components/Tab/TabItem";
import { PostProvider } from "@/context/PostContext";
import { TopicProvider } from "@/context/TopicContext";
import { VotingProvider } from "@/context/VotingContext";
import useAuth from "@/hooks/useAuth";
import useCommunity from "@/hooks/useCommunity";
import useNotification from "@/hooks/useNotification";
import { Community } from "@/models/Community";
import CommunityService from "@/services/CommunityService";
import { Box, Flex, Icon, Spinner, Text } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { BsFillFileEarmarkPostFill } from "react-icons/bs";
import { IoBanOutline } from "react-icons/io5";
import { MdOutlineHowToVote } from "react-icons/md";
import { VscPreview } from "react-icons/vsc";

type CommunityDetailPageProps = {
    community: Community;
};

const communityTab = [
    {
        title: "Chủ đề",
        icon: VscPreview,
    },
    {
        title: "Bài viết",
        icon: BsFillFileEarmarkPostFill,
    },
    {
        title: "Cuộc bình chọn",
        icon: MdOutlineHowToVote,
    },
];

const defaultScrollHeight = [
    {
        title: communityTab[0].title,
        height: 0,
    },
    {
        title: communityTab[1].title,
        height: 0,
    },
    {
        title: communityTab[2].title,
        height: 0,
    },
];

const CommunityDetailPage: React.FC<CommunityDetailPageProps> = ({
    community,
}) => {
    const { authAction, user } = useAuth();
    const { communityAction, communityState } = useCommunity();
    const { notificationAction } = useNotification();
    const [selectedTab, setSelectedTab] = useState(communityTab[0].title);
    const [scrollHeight, setScrollHeight] = useState(defaultScrollHeight);

    useEffect(() => {
        communityAction.setSelectedCommunity(community);
    }, [community]);

    useEffect(() => {
        authAction.setNeedAuth(false);
    }, []);

    useEffect(() => {
        if (user && community) {
            notificationAction.seen(user.uid, community.id!);
        }
    }, [user, community]);

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

    return (
        <>
            <Head>
                <title>{`MangaKr - Cộng đồng ${community?.name || ""}`}</title>
            </Head>
            <>
                {!community ? (
                    <NotAvailable title="Cộng đồng này không tồn tại hoặc đã bị xóa!" />
                ) : (
                    <Flex
                        direction="column"
                        flexGrow={1}
                        bg="white"
                        borderRadius={4}
                        boxShadow="lg"
                    >
                        <CommunityHeader community={community} />
                        <Flex position="relative" flexGrow={1}>
                            <Box
                                w="30%"
                                p={6}
                                py={8}
                                position="sticky"
                                top={20}
                                alignSelf="flex-start"
                                flexShrink={0}
                            >
                                <CommunityLeftSideBar />
                            </Box>
                            <Box
                                bg="white"
                                p={6}
                                flexGrow={1}
                                position="relative"
                            >
                                {communityState.communityLoading ? (
                                    <Flex align="center" justify="center">
                                        <Spinner my={4} />
                                    </Flex>
                                ) : CommunityService.canViewPosts({
                                      communityType:
                                          communityState.selectedCommunity
                                              ?.privacyType!,
                                      userRole:
                                          communityState.userCommunityRole
                                              ?.role,
                                      user,
                                  }) ? (
                                    <>
                                        <Flex
                                            width="100%"
                                            py={4}
                                            position="sticky"
                                            top={20}
                                            zIndex={100}
                                            bg="white"
                                        >
                                            {communityTab.map((item) => (
                                                <TabItem
                                                    key={item.title}
                                                    item={item}
                                                    selected={
                                                        item.title ===
                                                        selectedTab
                                                    }
                                                    setSelectedTab={onChangeTab}
                                                />
                                            ))}
                                        </Flex>
                                        <Flex
                                            direction="column"
                                            align="center"
                                            w="100%"
                                            px={12}
                                            mt={4}
                                        >
                                            <Flex
                                                display={
                                                    selectedTab ===
                                                    communityTab[0].title
                                                        ? "flex"
                                                        : "none"
                                                }
                                                direction="column"
                                                align="center"
                                                w="100%"
                                            >
                                                <TopicProvider
                                                    community={community}
                                                >
                                                    <CommunityTopicTab />
                                                </TopicProvider>
                                            </Flex>
                                            <Flex
                                                display={
                                                    selectedTab ===
                                                    communityTab[1].title
                                                        ? "flex"
                                                        : "none"
                                                }
                                                direction="column"
                                                align="center"
                                                w="100%"
                                            >
                                                <PostProvider
                                                    selectedCommunity={
                                                        community
                                                    }
                                                >
                                                    <CommunityPostTab />
                                                </PostProvider>
                                            </Flex>
                                            <Flex
                                                display={
                                                    selectedTab ===
                                                    communityTab[2].title
                                                        ? "flex"
                                                        : "none"
                                                }
                                                direction="column"
                                                align="center"
                                                w="100%"
                                            >
                                                <VotingProvider
                                                    community={community}
                                                >
                                                    <CommunityVotingTab />
                                                </VotingProvider>
                                            </Flex>
                                        </Flex>
                                    </>
                                ) : (
                                    <Flex
                                        align="center"
                                        justify="center"
                                        direction="column"
                                    >
                                        <Icon
                                            as={IoBanOutline}
                                            color="brand.100"
                                            fontSize={150}
                                        />
                                        <Text fontSize={24} fontWeight={500}>
                                            Vui lòng gia nhập cộng đồng để xem
                                            bài viết
                                        </Text>
                                    </Flex>
                                )}
                            </Box>
                        </Flex>
                    </Flex>
                )}
            </>
        </>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { cid } = context.query;
    const community = await CommunityService.get({
        communityId: cid as string,
    });
    if (community) {
        return {
            props: {
                community,
            },
        };
    }
    return {
        props: {},
    };
}

export default CommunityDetailPage;
