import CommunityHeader from "@/components/Community/Header";
import CommunityPostTab from "@/components/Community/PostTab";
import NotAvailable from "@/components/Error/NotAvailable";
import InfiniteScroll from "@/components/InfiniteScroll";
import PostItem from "@/components/Post/Item";
import TabItem from "@/components/Tab/TabItem";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import useCommunity from "@/hooks/useCommunity";
import { Community } from "@/models/Community";
import ModelUtils from "@/utils/ModelUtils";
import { Box, Flex, Spinner, Tab } from "@chakra-ui/react";
import { doc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { useEffect, useRef, useState } from "react";
import { BsFillFileEarmarkPostFill } from "react-icons/bs";
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
    const { communityAction } = useCommunity();
    const [selectedTab, setSelectedTab] = useState(communityTab[0].title);
    const [scrollHeight, setScrollHeight] = useState<number[]>([0, 0]);

    useEffect(() => {
        communityAction.setSelectedCommunity(community);
    }, [community]);

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
            <Flex position="relative">
                <Box
                    w="25%"
                    p={6}
                    position="sticky"
                    top={24}
                    alignSelf="flex-start"
                    flexShrink={0}
                >
                    Left Sidebar
                </Box>
                <Box bg="white" p={6} flexGrow={1} position="relative">
                    {/* {community.privacyType === "private" && (
                        <Text>Bạn cần tham gia cộng đồng này để xem bài viết</Text>
                    )} */}
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
                </Box>
            </Flex>
        </Flex>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { cid } = context.query;
    const community = await ModelUtils.getCommunity(cid as string);
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
