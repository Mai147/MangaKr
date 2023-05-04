import UserHorizontalSnippetItem from "@/components/User/Snippet/UserHorizontalSnippetItem";
import UserMessageSnippetItem from "@/components/User/Snippet/UserMessageSnippetItem";
import useAuth from "@/hooks/useAuth";
import { useMessage } from "@/hooks/useMessage";
import { UserModel } from "@/models/User";
import UserUtils from "@/utils/UserUtils";
import { VStack, Divider, Spinner, Flex, Text, Box } from "@chakra-ui/react";
import React from "react";
import MessageLeftSideBarHeader from "./Header";

type MessageLeftSideBarProps = {};

const MessageLeftSideBar: React.FC<MessageLeftSideBarProps> = () => {
    const { messageState, messageAction } = useMessage();
    const { user } = useAuth();
    return (
        <VStack
            align="flex-start"
            w="25%"
            spacing={0}
            borderRight="1px solid"
            borderColor="gray.400"
            flexShrink={0}
            display={{ base: "none", lg: "flex" }}
        >
            <MessageLeftSideBarHeader />
            <Divider />
            {messageState.isSearching ? (
                messageState.searchUser.output.list.map(
                    (us: UserModel) =>
                        us.uid !== user?.uid && (
                            <Box w="100%" key={us.uid}>
                                <UserHorizontalSnippetItem
                                    user={UserUtils.toUserSnippet(us)}
                                    border="none"
                                    boxShadow="none"
                                    isLink={false}
                                    size="md"
                                    onClick={() => {
                                        messageAction.switchUser(
                                            UserUtils.toUserSnippet(us)
                                        );
                                    }}
                                />
                            </Box>
                        )
                )
            ) : messageState.loading.getListUserLoading ? (
                <Flex align="center" justify="center" p={4} w="100%">
                    <Spinner />
                </Flex>
            ) : messageState.listUsers.length > 0 ? (
                messageState.listUsers.map((userMessage) => (
                    <UserMessageSnippetItem
                        key={userMessage.id}
                        userMessage={userMessage}
                        isActive={
                            userMessage.id === messageState.selectedUser?.id
                        }
                    />
                ))
            ) : (
                <Flex align="center" justify="center" p={4} w="100%">
                    <Text>Bạn chưa nhắn tin với người dùng nào!</Text>
                </Flex>
            )}
        </VStack>
    );
};
export default MessageLeftSideBar;
