import useAuth from "@/hooks/useAuth";
import useNotification from "@/hooks/useNotification";
import {
    Box,
    Flex,
    IconButton,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Stack,
} from "@chakra-ui/react";
import React from "react";
import { FiBell } from "react-icons/fi";
import NotificationItem from "../NotificationItem";

type NavNotificationProps = {};

const NavNotification: React.FC<NavNotificationProps> = () => {
    const { user } = useAuth();
    const { notificationState, notificationAction } = useNotification();
    return user ? (
        <>
            <Popover trigger={"click"} placement={"bottom-start"}>
                <PopoverTrigger>
                    <Box position="relative" onClick={notificationAction.read}>
                        <IconButton
                            size="lg"
                            variant="ghost"
                            aria-label="Notification"
                            borderRadius="full"
                            icon={<FiBell />}
                        />
                        {notificationState.isNotSeenList.length > 0 && (
                            <Flex
                                w="4"
                                h="4"
                                rounded="full"
                                bg="red"
                                position="absolute"
                                bottom="2"
                                right="2"
                                color="white"
                                fontSize={10}
                                fontWeight={500}
                                align="center"
                                justify="center"
                            >
                                {notificationState.isNotSeenList.length}
                            </Flex>
                        )}
                    </Box>
                </PopoverTrigger>

                <PopoverContent
                    border={0}
                    minW={"xs"}
                    boxShadow="lg"
                    rounded="xl"
                    overflow="hidden"
                >
                    <Stack
                        spacing={0}
                        maxH="300px"
                        overflow="auto"
                        className="scroll"
                    >
                        {notificationState.list.map((noti, idx) => (
                            <NotificationItem
                                key={noti.id}
                                notificationData={noti}
                                isLast={
                                    idx === notificationState.list.length - 1
                                }
                            />
                        ))}
                    </Stack>
                </PopoverContent>
            </Popover>
        </>
    ) : (
        <></>
    );
};
export default NavNotification;
