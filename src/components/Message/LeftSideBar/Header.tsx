import { routes } from "@/constants/routes";
import { useMessage } from "@/hooks/useMessage";
import {
    VStack,
    InputGroup,
    InputLeftElement,
    Input,
    Text,
    IconButton,
    Flex,
    Link,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

type MessageLeftSideBarHeaderProps = {};

const MessageLeftSideBarHeader: React.FC<
    MessageLeftSideBarHeaderProps
> = () => {
    const { messageAction, messageState } = useMessage();
    return (
        <VStack px={6} py={4} align="flex-start" w="100%" spacing={2}>
            <Flex align="center" justify="space-between" w="100%">
                <Text fontSize={20} fontWeight={600}>
                    Tin nhắn
                </Text>
                <Link href={routes.getHomePage()}>
                    <IconButton
                        aria-label="Home button"
                        icon={<AiOutlineArrowLeft />}
                        variant="ghost"
                        fontSize={24}
                    />
                </Link>
            </Flex>
            <Flex w="100%" align="center">
                <InputGroup flexGrow={1} onFocus={messageAction.openSearch}>
                    <InputLeftElement
                        pointerEvents="none"
                        children={<FiSearch color="gray.300" />}
                    />
                    <Input
                        type="text"
                        placeholder="Tìm kiếm người dùng..."
                        value={messageState.searchValue}
                        borderColor="gray.400"
                        onChange={(e) => messageAction.search(e.target.value)}
                    />
                </InputGroup>
                {messageState.isSearching && (
                    <IconButton
                        aria-label="close"
                        icon={<IoMdClose />}
                        flexShrink={0}
                        size="xs"
                        ml={2}
                        variant="outline"
                        fontSize={12}
                        onClick={messageAction.closeSearch}
                    />
                )}
            </Flex>
        </VStack>
    );
};
export default MessageLeftSideBarHeader;
