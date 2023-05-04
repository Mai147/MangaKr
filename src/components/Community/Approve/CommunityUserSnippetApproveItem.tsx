import { CommunityUserSnippet } from "@/models/User";
import { Avatar, Box, Flex, HStack, IconButton, Text } from "@chakra-ui/react";
import moment from "moment";
import React, { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { MdOutlineClear } from "react-icons/md";
import { userHeaderList } from "./CommunityUserApprove";

type CommunityUserSnippetApproveItemProps = {
    user: CommunityUserSnippet;
};

const CommunityUserSnippetApproveItem: React.FC<
    CommunityUserSnippetApproveItemProps
> = ({ user }) => {
    return (
        <Flex
            justify="space-between"
            align="center"
            w="100%"
            px={{ base: 2, md: 4 }}
            py={4}
            _hover={{ bg: "gray.50" }}
        >
            <HStack spacing={4} flexGrow={1}>
                <Box w={userHeaderList[0].width}>
                    <Avatar src={user.imageUrl || "/images/noImage.jpg"} />
                </Box>
                <Text w={userHeaderList[1].width} flexShrink={0}>
                    {user.displayName}
                </Text>
                <Box
                    w={userHeaderList[2].width}
                    flexShrink={0}
                    display={userHeaderList[2].display}
                >
                    {user.createdAt?.seconds && (
                        <Text>
                            {moment(
                                new Date(user.createdAt?.seconds * 1000)
                            ).format("DD/MM/YYYY")}
                        </Text>
                    )}
                </Box>
            </HStack>
        </Flex>
    );
};
export default CommunityUserSnippetApproveItem;
