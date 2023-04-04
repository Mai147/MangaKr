import CommunityHeader from "@/components/Community/Header";
import CommunityLeftSideBar from "@/components/Community/LeftSideBar";
import CommunityPostTab from "@/components/Community/PostTab";
import CommunityTopicTab from "@/components/Community/TopicTab";
import NotAvailable from "@/components/Error/NotAvailable";
import TabItem from "@/components/Tab/TabItem";
import useAuth from "@/hooks/useAuth";
import useCommunity from "@/hooks/useCommunity";
import { Community } from "@/models/Community";
import CommunityService from "@/services/CommunityService";
import { Box, Flex, Icon, Spinner, Text } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import React, { useEffect, useState } from "react";
import { BsFillFileEarmarkPostFill } from "react-icons/bs";
import { IoBanOutline } from "react-icons/io5";
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
];

const CommunityDetailPage: React.FC<CommunityDetailPageProps> = ({
    community,
}) => {
    const { setNeedAuth, user } = useAuth();
    const { communityAction, communityState } = useCommunity();
    const [selectedTab, setSelectedTab] = useState(communityTab[0].title);
    const [scrollHeight, setScrollHeight] = useState<number[]>([0, 0]);

    useEffect(() => {
        communityAction.setSelectedCommunity(community);
    }, [community]);

    useEffect(() => {
        setNeedAuth(false);
    }, []);

    if (!community) {
        return (
            <NotAvailable title="Cộng đồng này không tồn tại hoặc đã bị xóa!" />
        );
    }

    const onChangeTab = (value: string) => {
        const firstTab = value === communityTab[0].title;
        firstTab
            ? setScrollHeight((prev) => [
                  prev[0],
                  document.documentElement.scrollTop,
              ])
            : setScrollHeight((prev) => [
                  document.documentElement.scrollTop,
                  prev[1],
              ]);
        setSelectedTab(value);
        setTimeout(() => {
            window.scrollTo(0, firstTab ? scrollHeight[0] : scrollHeight[1]);
        }, 0);
    };

    return (
        <Flex direction="column" flexGrow={1} bg="white" borderRadius={4}>
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
                <Box bg="white" p={6} flexGrow={1} position="relative">
                    {communityState.communityLoading ? (
                        <Flex align="center" justify="center">
                            <Spinner my={4} />
                        </Flex>
                    ) : CommunityService.canViewPosts({
                          communityType:
                              communityState.selectedCommunity?.privacyType!,
                          userRole: communityState.userCommunityRole?.role,
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
                                        selected={item.title === selectedTab}
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
                                        selectedTab === communityTab[0].title
                                            ? "flex"
                                            : "none"
                                    }
                                    direction="column"
                                    align="center"
                                    w="100%"
                                >
                                    <CommunityTopicTab />
                                </Flex>
                                <Flex
                                    display={
                                        selectedTab === communityTab[1].title
                                            ? "flex"
                                            : "none"
                                    }
                                    direction="column"
                                    align="center"
                                    w="100%"
                                >
                                    <CommunityPostTab />
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
                                Vui lòng gia nhập cộng đồng để xem bài viết
                            </Text>
                        </Flex>
                    )}
                </Box>
            </Flex>
        </Flex>
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
