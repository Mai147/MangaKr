import { Flex, HStack, IconButton, Divider, Box, Text } from "@chakra-ui/react";
import React, { ReactNode, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { CgLock, CgLockUnlock } from "react-icons/cg";
import { MdOutlineClear } from "react-icons/md";

type CommunityInfoApproveItemProps = {
    child: ReactNode;
    handleApprove?: (isAccept: boolean) => Promise<void>;
    handleLock?: () => Promise<void>;
    isAccept: boolean;
    itemLockStatus?: boolean;
};

const CommunityInfoApproveItem: React.FC<CommunityInfoApproveItemProps> = ({
    child,
    handleApprove,
    handleLock,
    isAccept,
    itemLockStatus,
}) => {
    const [acceptLoading, setAcceptLoading] = useState(false);
    const [deleLoading, setDeleteLoading] = useState(false);
    const [lockLoading, setLockLoading] = useState(false);
    return (
        <Box w="100%" _hover={{ bg: "gray.50" }} transition="all 0.3s">
            <Flex align="center">
                {child}
                {!isAccept ? (
                    <HStack spacing={10} p={4}>
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
                            onClick={async (e) => {
                                e.stopPropagation();
                                setAcceptLoading(true);
                                handleApprove && (await handleApprove(true));
                                setAcceptLoading(false);
                            }}
                        />
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
                            onClick={async (e) => {
                                e.stopPropagation();
                                setDeleteLoading(true);
                                handleApprove && (await handleApprove(false));
                                setDeleteLoading(false);
                            }}
                        />
                    </HStack>
                ) : (
                    <Box p={4}>
                        <IconButton
                            aria-label="approve-button"
                            icon={
                                itemLockStatus ? (
                                    <CgLock fontSize={16} />
                                ) : (
                                    <CgLockUnlock fontSize={16} />
                                )
                            }
                            ml={10}
                            flexShrink={0}
                            bg={itemLockStatus ? "brand.100" : "green.300"}
                            _hover={{
                                bg: itemLockStatus ? "brand.400" : "green.400",
                            }}
                            isLoading={lockLoading}
                            onClick={async (e) => {
                                e.stopPropagation();
                                setLockLoading(true);
                                handleLock && (await handleLock());
                                setLockLoading(false);
                            }}
                        />
                    </Box>
                )}
            </Flex>
            <Divider borderColor="gray.300" />
        </Box>
    );
};
export default CommunityInfoApproveItem;
