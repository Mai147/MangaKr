import PageContent from "@/components/Layout/PageContent";
import RightSidebar from "@/components/Layout/Sidebar/RightSidebar";
import SearchResult from "@/components/Search";
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
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { FiSearch } from "react-icons/fi";

type SearchPageProps = {};

const SearchPage: React.FC<SearchPageProps> = () => {
    const rounter = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <>
            <Head>
                <title>MangaKr - Tìm kiếm</title>
            </Head>
            <>
                <PageContent>
                    <Flex direction="column" flexGrow={1} p={4}>
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
                        <SearchProvider>
                            <SearchResult />
                        </SearchProvider>
                    </Flex>
                    <RightSidebar />
                </PageContent>
            </>
        </>
    );
};

export default SearchPage;
