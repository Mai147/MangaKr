import BookService from "@/services/BookService";
import CommunityService from "@/services/CommunityService";
import PostService from "@/services/PostService";
import UserService from "@/services/UserService";
import { HStack, Flex, VStack, Box, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IconType } from "react-icons";
import {
    AiOutlineUser,
    AiOutlineUserAdd,
    AiOutlineUsergroupAdd,
} from "react-icons/ai";
import { BiBookAdd } from "react-icons/bi";
import { FiBookOpen } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { TiDocument, TiDocumentAdd } from "react-icons/ti";
import SummaryDetailItem from "./SummaryDetailItem";
import SummaryItem from "./SummaryItem";

type SummarySectionProps = {};

type SummaryData = {
    users: {
        total: number;
        today: number;
    };
    mangas: {
        total: number;
        today: number;
    };
    communities: {
        total: number;
        today: number;
    };
    posts: {
        total: number;
        today: number;
    };
};

type SummaryField = {
    field: "users" | "mangas" | "communities" | "posts";
    total: {
        icon: IconType;
        color: string;
        title: string;
    };
    today: {
        icon: IconType;
        color: string;
        title: string;
    };
};

const defaultSummaryData: SummaryData = {
    users: {
        today: 0,
        total: 0,
    },
    communities: {
        today: 0,
        total: 0,
    },
    mangas: {
        today: 0,
        total: 0,
    },
    posts: {
        today: 0,
        total: 0,
    },
};

const listSummary: SummaryField[] = [
    {
        field: "users",
        total: {
            icon: AiOutlineUser,
            color: "blue.100",
            title: "Người dùng",
        },
        today: {
            icon: AiOutlineUserAdd,
            color: "blue.100",
            title: "Tài khoản hôm nay",
        },
    },
    {
        field: "mangas",
        total: {
            icon: FiBookOpen,
            color: "red.100",
            title: "Manga",
        },
        today: {
            icon: BiBookAdd,
            color: "red.100",
            title: "Manga hôm nay",
        },
    },
    {
        field: "communities",

        total: {
            icon: HiOutlineUserGroup,
            color: "yellow.100",
            title: "Cộng đồng",
        },
        today: {
            icon: AiOutlineUsergroupAdd,
            color: "yellow.100",
            title: "Cộng đồng hôm nay",
        },
    },
    {
        field: "posts",

        total: {
            icon: TiDocument,
            color: "green.100",
            title: "Bài viết",
        },
        today: {
            icon: TiDocumentAdd,
            color: "green.100",
            title: "Bài viết hôm nay",
        },
    },
];

const SummarySection: React.FC<SummarySectionProps> = () => {
    const [summaryData, setSummaryData] =
        useState<SummaryData>(defaultSummaryData);
    const getDatas = async () => {
        const userTotalCount = await UserService.count({ isToday: false });
        const userTodayCount = await UserService.count({ isToday: true });
        const bookTotalCount = await BookService.count({ isToday: false });
        const bookTodayCount = await BookService.count({ isToday: true });
        const postTotalCount = await PostService.count({ isToday: false });
        const postTodayCount = await PostService.count({ isToday: true });
        const communityTotalCount = await CommunityService.count({
            isToday: false,
        });
        const communityTodayCount = await CommunityService.count({
            isToday: true,
        });
        setSummaryData((prev) => ({
            users: {
                total: userTotalCount,
                today: userTodayCount,
            },
            mangas: {
                total: bookTotalCount,
                today: bookTodayCount,
            },
            communities: {
                total: communityTotalCount,
                today: communityTodayCount,
            },
            posts: {
                total: postTotalCount,
                today: postTodayCount,
            },
        }));
    };

    useEffect(() => {
        getDatas();
    }, []);
    return (
        <HStack align="stretch" spacing={8} mb={4}>
            <Flex w="50%">
                <Box p={6} borderRadius={8} bg="white" w="100%" boxShadow="md">
                    <Text fontWeight={700} fontSize={18} mb={8}>
                        Tổng quan
                    </Text>
                    <VStack>
                        {listSummary.map((item) => (
                            <SummaryItem
                                icon={item.total.icon}
                                title={item.total.title}
                                color={item.total.color}
                                data={summaryData[item.field].total}
                                key={item.field}
                            />
                        ))}
                    </VStack>
                </Box>
            </Flex>
            <Flex justify="space-evenly" direction="column" flexGrow={1}>
                {listSummary.map((item) => (
                    <SummaryDetailItem
                        icon={item.today.icon}
                        title={item.today.title}
                        color={item.today.color}
                        data={summaryData[item.field].today}
                        key={item.field}
                    />
                ))}
            </Flex>
        </HStack>
    );
};
export default SummarySection;
