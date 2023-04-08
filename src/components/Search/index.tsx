import { routes } from "@/constants/routes";
import useSearch from "@/hooks/useSearch";
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
import React, { useRef } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { BsBook } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineRateReview } from "react-icons/md";
import Pagination from "../Pagination";
import TabItem from "../Tab/TabItem";
import SearchAuthorTab from "./AuthorTab";
import SearchBookTab from "./BookTab";
import SearchCommunityTab from "./CommunityTab";
import SearchReviewTab from "./ReviewTab";
import SearchUserTab from "./UserTab";

type SearchResultProps = {};

const searchTab = [
    {
        title: "Manga",
        icon: BsBook,
        field: "book",
    },
    {
        title: "Bài đánh giá",
        icon: MdOutlineRateReview,
        field: "review",
    },
    {
        title: "Tác giả",
        icon: IoPersonOutline,
        field: "author",
    },
    {
        title: "Cộng đồng",
        icon: HiOutlineUserGroup,
        field: "community",
    },
    {
        title: "Người dùng",
        icon: AiOutlineUser,
        field: "user",
    },
];

const SearchResult: React.FC<SearchResultProps> = () => {
    const { searchState, searchAction } = useSearch();

    return (
        <Flex direction="column" justifyContent="space-between" flexGrow={1}>
            <Box>
                <Flex width="100%" mb={4}>
                    {searchTab.map((item) => (
                        <TabItem
                            key={item.title}
                            item={item}
                            selected={item.field === searchState.selectedField}
                            setSelectedTab={(value) =>
                                searchAction.setSelectedTab(item.field as any)
                            }
                        />
                    ))}
                </Flex>
                <Flex p={4}>
                    {searchState.selectedField === searchTab[0].field && (
                        <SearchBookTab />
                    )}
                    {searchState.selectedField === searchTab[1].field && (
                        <SearchReviewTab />
                    )}
                    {searchState.selectedField === searchTab[2].field && (
                        <SearchAuthorTab />
                    )}
                    {searchState.selectedField === searchTab[3].field && (
                        <SearchCommunityTab />
                    )}
                    {searchState.selectedField === searchTab[4].field && (
                        <SearchUserTab />
                    )}
                </Flex>
            </Box>
            <Pagination
                page={searchState[searchState.selectedField].output.page}
                totalPage={
                    searchState[searchState.selectedField].output.totalPage
                }
                onNext={searchAction.onNext}
                onPrev={searchAction.onPrev}
            />
        </Flex>
    );
};
export default SearchResult;
