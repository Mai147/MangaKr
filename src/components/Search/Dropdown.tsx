import useDebounce from "@/hooks/useDebounce";
import { Flex, Input, Box, Text } from "@chakra-ui/react";
import { Option } from "chakra-multiselect";
import React, { useEffect, useRef, useState } from "react";

type SearchDropdownProps = {
    options: Option[];
    onSearch: () => Promise<void>;
    search: string;
    setSearch: (value: string) => void;
    setSelected: (value: string) => void;
    size?: string;
};

const SearchDropdown: React.FC<SearchDropdownProps> = ({
    onSearch,
    options,
    search,
    setSearch,
    setSelected,
    size,
}) => {
    const [isSearching, setIsSearching] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const searchRef = useRef<HTMLInputElement>(null);
    const resultRef = useRef<HTMLDivElement>(null);
    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        if (!isSearching) {
            setSearch(
                (options &&
                    options[selectedIndex] &&
                    options[selectedIndex].label) ||
                    ""
            );
            setSelected(
                (options &&
                    options[selectedIndex] &&
                    (options[selectedIndex].value as string)) ||
                    ""
            );
        }
        onSearch();
    }, [debouncedSearch, isSearching]);

    useEffect(() => {
        const selected = resultRef.current?.querySelector(".active");
        if (selected) {
            selected.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [selectedIndex]);

    return (
        <Flex direction="column">
            <Input
                ref={searchRef}
                size={size}
                value={search}
                onFocus={(e) => setIsSearching(true)}
                onBlur={(e) => {
                    setIsSearching(false);
                }}
                onChange={(e) => setSearch(e.target.value)}
                onKeyUp={(e) => {
                    if (e.key === "Enter") {
                        searchRef.current!.blur();
                    } else if (e.key === "ArrowDown") {
                        setSelectedIndex((prev) => {
                            return (prev + 1) % (options?.length || 1);
                        });
                    } else if (e.key === "ArrowUp") {
                        setSelectedIndex((prev) => {
                            return (
                                (prev - 1 + (options?.length || 1)) %
                                (options?.length || 1)
                            );
                        });
                    }
                }}
            />
            {isSearching && (
                <Flex
                    direction="column"
                    boxShadow="md"
                    mt={1}
                    p={2}
                    maxH="200px"
                    overflow="auto"
                    ref={resultRef}
                >
                    {options && options?.length > 0 ? (
                        options?.map((option, idx) => (
                            <Box
                                key={option.value}
                                py={2}
                                px={2}
                                w="100%"
                                bg={
                                    idx === selectedIndex ? "gray.100" : "white"
                                }
                                borderRadius={2}
                                cursor="pointer"
                                className={
                                    idx === selectedIndex ? "active" : ""
                                }
                                onMouseDown={() => {
                                    setSelectedIndex(idx);
                                }}
                            >
                                <Text size={size} noOfLines={1}>
                                    {option.label}
                                </Text>
                            </Box>
                        ))
                    ) : (
                        <Box py={2} px={2} w="100%" borderRadius={2}>
                            <Text size={size} noOfLines={1}>
                                Không có kết quả tìm kiếm
                            </Text>
                        </Box>
                    )}
                </Flex>
            )}
        </Flex>
    );
};
export default SearchDropdown;
