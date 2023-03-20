import PageContent from "@/components/Layout/PageContent";
import RightSidebar from "@/components/Layout/Sidebar/RightSidebar";
import SearchAuthorTab from "@/components/Search/AuthorTab";
import SearchBookTab from "@/components/Search/BookTab";
import SearchCommunityTab from "@/components/Search/CommunityTab";
import SearchReviewTab from "@/components/Search/ReviewTab";
import TabItem from "@/components/Tab/TabItem";
import { HOME_PAGE } from "@/constants/routes";
import { SearchProvider } from "@/context/SearchContext";
import ModelUtils from "@/utils/ModelUtils";
import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BsBook } from "react-icons/bs";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineRateReview } from "react-icons/md";

type SearchPageProps = {};

const searchTab = [
    {
        title: "Manga",
        icon: BsBook,
    },
    {
        title: "Bài đánh giá",
        icon: MdOutlineRateReview,
    },
    {
        title: "Tác giả",
        icon: IoPersonOutline,
    },
    {
        title: "Cộng đồng",
        icon: HiOutlineUserGroup,
    },
    // {
    //     title: "Nhân vật",
    //     icon: BsPerson,
    // },
    // {
    //     title: "Khác",
    //     icon: BsInfoCircle,
    // },
];

const SearchPage: React.FC<SearchPageProps> = () => {
    const [selectedTab, setSelectedTab] = useState(searchTab[0].title);
    const rounter = useRouter();
    return (
        <PageContent>
            <Box>
                <Text fontSize={24} fontWeight={600}>
                    Kết quả tìm kiếm cho "{rounter.query.q}"
                </Text>
                <Divider my={4} borderColor="gray.300" />
                <Box>
                    <Flex width="100%" mb={4}>
                        {searchTab.map((item) => (
                            <TabItem
                                key={item.title}
                                item={item}
                                selected={item.title === selectedTab}
                                setSelectedTab={setSelectedTab}
                            />
                        ))}
                    </Flex>
                    <SearchProvider>
                        <Flex p={4}>
                            {selectedTab === searchTab[0].title && (
                                <SearchBookTab />
                            )}
                            {selectedTab === searchTab[1].title && (
                                <SearchReviewTab />
                            )}
                            {selectedTab === searchTab[2].title && (
                                <SearchAuthorTab />
                            )}
                            {selectedTab === searchTab[3].title && (
                                <SearchCommunityTab />
                            )}
                        </Flex>
                    </SearchProvider>
                </Box>
            </Box>
            <RightSidebar />
        </PageContent>
    );
};

export default SearchPage;
