import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { Topic } from "@/models/Topic";
import TopicService from "@/services/TopicService";
import { Flex, Avatar, HStack, Button, Text, Link } from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useState } from "react";

type TopicItemHeaderProps = {
    topic: Topic;
    canBack?: boolean;
    canChangeStatus?: boolean;
};

const TopicItemHeader: React.FC<TopicItemHeaderProps> = ({
    topic,
    canBack = true,
    canChangeStatus = true,
}) => {
    const { user } = useAuth();
    const [changeStatusLoading, setChangeStatusLoading] = useState(false);
    const router = useRouter();
    return (
        <Flex
            align={{ base: "flex-start", md: "center" }}
            justify="space-between"
            direction={{ base: "column", md: "row" }}
        >
            <Flex align="center">
                <Text as="span" fontSize={14} color="gray.400" display="inline">
                    Tạo bởi{" "}
                    <Text display="inline" color="gray.600" fontWeight={500}>
                        {topic.creatorDisplayName}
                    </Text>
                </Text>
                <Avatar
                    src={topic.creatorImageUrl || "/images/noImage.jpg"}
                    size="sm"
                    ml={2}
                />
                {topic.createdAt && (
                    <Text color="gray.400" fontSize={14} ml={4}>
                        {moment(new Date(topic.createdAt.seconds * 1000))
                            .locale("vi")
                            .fromNow()}
                    </Text>
                )}
            </Flex>
            <HStack spacing={4} mt={{ base: 4, md: 0 }}>
                {canChangeStatus && user && user.uid === topic.creatorId && (
                    <Button
                        variant="outline"
                        isLoading={changeStatusLoading}
                        size={{ base: "sm", sm: "md" }}
                        onClick={async () => {
                            setChangeStatusLoading(true);
                            await TopicService.changeStatus({
                                isClose: !topic.isClose,
                                topic,
                            });
                            setChangeStatusLoading(false);
                            router.reload();
                        }}
                    >
                        {topic.isClose ? "Mở chủ đề" : "Đóng chủ đề"}
                    </Button>
                )}
                {canBack && (
                    <Link
                        href={routes.getCommunityDetailPage(topic.communityId)}
                        _hover={{ textDecoration: "none" }}
                    >
                        <Button size={{ base: "sm", sm: "md" }}>
                            Quay lại cộng đồng
                        </Button>
                    </Link>
                )}
            </HStack>
        </Flex>
    );
};
export default TopicItemHeader;
