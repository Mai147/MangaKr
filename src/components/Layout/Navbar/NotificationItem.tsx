import { Stack, Box, Text, Flex, Icon, Link, Avatar } from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import "moment/locale/vi";
import React from "react";
import { BsChevronRight } from "react-icons/bs";

export type NotificationItemProps = {
    userName: string;
    communityName: string;
    content: string;
    imageUrl?: string;
    createdAt?: Timestamp;
    href?: string;
    isLast?: boolean;
    isReading?: boolean;
};

const NotificationItem: React.FC<NotificationItemProps> = ({
    communityName,
    userName,
    href,
    createdAt,
    imageUrl,
    content,
    isLast = false,
    isReading = false,
}) => {
    return (
        <Flex
            direction="column"
            bg={isReading ? "white" : "rgba(200,60,30,0.1)"}
            borderBottom="1px solid"
            borderColor={isLast ? "transparent" : "gray.300"}
        >
            <Link
                href={href}
                role={"group"}
                display={"block"}
                p={2}
                _hover={{ decoration: "none" }}
            >
                <Stack direction={"row"} align={"center"}>
                    {
                        <Avatar
                            src={imageUrl || "/images/noImage.jpg"}
                            size="md"
                            mr={2}
                        />
                    }
                    <Box>
                        <Text lineHeight={1.3} mb={1}>
                            <Text as="span" fontWeight={500} display="inline">
                                {userName}
                            </Text>{" "}
                            {content}{" "}
                            <Text as="span" fontWeight={500} display="inline">
                                {communityName}
                            </Text>
                        </Text>
                        {createdAt && (
                            <Text color="gray.600" fontSize={12}>
                                {moment(new Date(createdAt.seconds * 1000))
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
                    >
                        <Icon
                            color={"brand.100"}
                            w={5}
                            h={5}
                            as={BsChevronRight}
                        />
                    </Flex>
                </Stack>
            </Link>
        </Flex>
    );
};

export default NotificationItem;
