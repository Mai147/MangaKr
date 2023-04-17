import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import useNotification from "@/hooks/useNotification";
import { Notification } from "@/models/Notification";
import UserService from "@/services/UserService";
import NotificationUtils from "@/utils/NotificationUtils";
import {
    Stack,
    Box,
    Text,
    Flex,
    Icon,
    Link,
    Avatar,
    IconButton,
    HStack,
} from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/vi";
import React, { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { BsChevronRight } from "react-icons/bs";
import { MdOutlineClear } from "react-icons/md";

export type NotificationItemProps = {
    notificationData: Notification;
    href?: string;
    isLast?: boolean;
};

const NotificationItem: React.FC<NotificationItemProps> = ({
    notificationData,
    href,
    isLast = false,
}) => {
    const [acceptFollowLoading, setAcceptFollowLoading] = useState(false);
    const [declineFollowLoading, setDeclineFollowLoading] = useState(false);
    const { user } = useAuth();
    const { toggleView } = useModal();
    const { notificationAction } = useNotification();
    return (
        <Flex
            direction="column"
            bg={
                notificationData.isSeen || notificationData.isRead
                    ? "white"
                    : "rgba(200,60,30,0.1)"
            }
            borderBottom="1px solid"
            borderColor={isLast ? "transparent" : "gray.300"}
        >
            <Link
                href={NotificationUtils.getHref(notificationData)}
                role={"group"}
                display={"block"}
                p={2}
                _hover={{ decoration: "none" }}
            >
                <Stack direction={"row"} align={"center"}>
                    {
                        <Avatar
                            src={
                                notificationData.imageUrl ||
                                "/images/noImage.jpg"
                            }
                            size="md"
                            mr={2}
                        />
                    }
                    <Box>
                        <Text lineHeight={1.3} mb={1}>
                            <Text as="span" fontWeight={500} display="inline">
                                {notificationData.creatorDisplayName}
                            </Text>{" "}
                            {notificationData.content}{" "}
                            <Text as="span" fontWeight={500} display="inline">
                                {notificationData.targetName}
                            </Text>
                        </Text>
                        {notificationData.createdAt && (
                            <Text color="gray.600" fontSize={12}>
                                {moment(
                                    new Date(
                                        notificationData.createdAt.seconds *
                                            1000
                                    )
                                )
                                    .locale("vi")
                                    .fromNow()}
                            </Text>
                        )}
                    </Box>

                    <Flex
                        transition={"all .3s ease"}
                        transform={"translateX(-10px)"}
                        opacity={0}
                        _groupHover={{
                            opacity: "100%",
                            transform: "translateX(0)",
                        }}
                        justify={"flex-end"}
                        align={"center"}
                        flex={1}
                        display={href ? "flex" : "none"}
                    >
                        <Icon
                            color={"brand.100"}
                            w={5}
                            h={5}
                            as={BsChevronRight}
                        />
                    </Flex>
                </Stack>
                {notificationData.type === "FOLLOW_REQUEST" && (
                    <HStack justify="flex-end" spacing={4}>
                        <IconButton
                            aria-label="accept"
                            icon={<AiOutlineCheck />}
                            bg="green.300"
                            fontSize={16}
                            _hover={{ bg: "green.400" }}
                            size="md"
                            isLoading={acceptFollowLoading}
                            isDisabled={declineFollowLoading}
                            onClick={async () => {
                                if (!user) {
                                    toggleView("login");
                                    return;
                                }
                                setAcceptFollowLoading(true);
                                await UserService.acceptFollow({
                                    userId: notificationData.id!,
                                    follower: {
                                        id: user.uid,
                                        displayName: user.displayName!,
                                        imageUrl: user.photoURL,
                                    },
                                });
                                notificationAction.clear(notificationData.id!);
                                setAcceptFollowLoading(false);
                            }}
                        />
                        <IconButton
                            aria-label="accept"
                            icon={<MdOutlineClear />}
                            fontSize={16}
                            size="md"
                            isLoading={declineFollowLoading}
                            isDisabled={acceptFollowLoading}
                            onClick={async () => {
                                if (!user) {
                                    toggleView("login");
                                    return;
                                }
                                setDeclineFollowLoading(true);
                                await UserService.declineFollow({
                                    userId: notificationData.id!,
                                    followerId: user.uid,
                                });
                                notificationAction.clear(notificationData.id!);
                                setDeclineFollowLoading(false);
                            }}
                        />
                    </HStack>
                )}
            </Link>
        </Flex>
    );
};

export default NotificationItem;
