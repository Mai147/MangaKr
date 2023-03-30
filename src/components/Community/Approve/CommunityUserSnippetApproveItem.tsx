import { CommunityUserSnippet } from "@/models/User";
import { Avatar, Box, Flex, HStack, IconButton, Text } from "@chakra-ui/react";
import moment from "moment";
import React, { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { MdOutlineClear } from "react-icons/md";

type CommunityUserSnippetApproveItemProps = {
    user: CommunityUserSnippet;
    isDeleteOnly: boolean;
    handleApprove?: (isAccept: boolean) => Promise<void>;
};

const CommunityUserSnippetApproveItem: React.FC<
    CommunityUserSnippetApproveItemProps
> = ({ user, handleApprove, isDeleteOnly }) => {
    const [acceptLoading, setAcceptLoading] = useState(false);
    const [deleLoading, setDeleteLoading] = useState(false);
    return (
        <Flex
            justify="space-between"
            align="center"
            w="100%"
            p={4}
            _hover={{ bg: "gray.50" }}
        >
            <HStack spacing={4} flexGrow={1}>
                <Box w="100px">
                    <Avatar src={user.imageUrl || "/images/noImage.jpg"} />
                </Box>
                <Text w="300px" flexShrink={0}>
                    {user.displayName}
                </Text>
                <Box w="200px" flexShrink={0}>
                    {user.createdAt?.seconds && (
                        <Text>
                            {moment(
                                new Date(user.createdAt?.seconds * 1000)
                            ).format("DD/MM/YYYY")}
                        </Text>
                    )}
                </Box>
            </HStack>
            <HStack spacing={4}>
                {!isDeleteOnly && (
                    <IconButton
                        aria-label="approve-button"
                        icon={<AiOutlineCheck fontSize={16} />}
                        ml={10}
                        flexShrink={0}
                        bg={"green.300"}
                        _hover={{
                            bg: "green.400",
                        }}
                        isLoading={acceptLoading}
                        isDisabled={deleLoading}
                        onClick={async () => {
                            setAcceptLoading(true);
                            handleApprove && (await handleApprove(true));
                            setAcceptLoading(false);
                        }}
                    />
                )}
                <IconButton
                    aria-label="approve-button"
                    icon={<MdOutlineClear fontSize={16} />}
                    ml={10}
                    flexShrink={0}
                    bg={"brand.100"}
                    _hover={{
                        bg: "brand.400",
                    }}
                    isLoading={deleLoading}
                    isDisabled={acceptLoading}
                    onClick={async () => {
                        setDeleteLoading(true);
                        handleApprove && (await handleApprove(false));
                        setDeleteLoading(false);
                    }}
                />
            </HStack>
        </Flex>
    );
};
export default CommunityUserSnippetApproveItem;
