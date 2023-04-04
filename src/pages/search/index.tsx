import PageContent from "@/components/Layout/PageContent";
import RightSidebar from "@/components/Layout/Sidebar/RightSidebar";
import SearchAuthorTab from "@/components/Search/AuthorTab";
import SearchBookTab from "@/components/Search/BookTab";
import SearchCommunityTab from "@/components/Search/CommunityTab";
import SearchReviewTab from "@/components/Search/ReviewTab";
import SearchUserTab from "@/components/Search/UserTab";
import TabItem from "@/components/Tab/TabItem";
import { routes } from "@/constants/routes";
import { SearchProvider } from "@/context/SearchContext";
import {
    Box,
    Divider,
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { BsBook } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
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
    {
        title: "Người dùng",
        icon: AiOutlineUser,
    },
];

const SearchPage: React.FC<SearchPageProps> = () => {
    const [selectedTab, setSelectedTab] = useState(searchTab[0].title);
    const rounter = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <PageContent>
            <Box>
                <Text fontSize={24} fontWeight={600}>
                    Kết quả tìm kiếm cho "{rounter.query.q}"
                </Text>
                <InputGroup my={4}>
                    <InputLeftElement
                        pointerEvents="none"
                        children={<FiSearch color="gray.300" />}
                    />
                    <Input
                        type="text"
                        placeholder="Tìm kiếm manga, tin tức..."
                        bg="white"
                        ref={inputRef}
                        onKeyUp={(event) => {
                            if (event.key === "Enter") {
                                if (inputRef.current) {
                                    rounter.push(
                                        `${routes.getSearchPage()}?q=${
                                            inputRef.current.value
                                        }`
                                    );
                                    inputRef.current.blur();
                                }
                            }
                        }}
                    />
                </InputGroup>
                <Divider my={4} borderColor="gray.400" />
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
                            {selectedTab === searchTab[4].title && (
                                <SearchUserTab />
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
