import { REPLY_TOPIC_PAGE_COUNT } from "@/constants/pagination";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import usePagination, {
    PaginationInput,
    defaultPaginationInput,
} from "@/hooks/usePagination";
import { Topic, TopicReply } from "@/models/Topic";
import TopicService from "@/services/TopicService";
import {
    AspectRatio,
    Avatar,
    Box,
    Button,
    Divider,
    Flex,
    HStack,
    Image,
    Link,
    Text,
} from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import TopicReplyList from "./Reply/ReplyList";
import TopicReplyInput from "./Reply/TopicReplyInput";

type TopicItemProps = {
    topic: Topic;
};

interface TopicReplyPaginationInput extends PaginationInput {
    topicId: string;
    communityId: string;
}

const defaultTopicReplyPaginationInput: TopicReplyPaginationInput = {
    ...defaultPaginationInput,
    pageCount: REPLY_TOPIC_PAGE_COUNT,
    communityId: "",
    topicId: "",
};

const TopicItem: React.FC<TopicItemProps> = ({ topic }) => {
    const { user } = useAuth();
    const { getTopicReplies } = usePagination();
    const [replyList, setReplyList] = useState<TopicReply[]>([]);
    const [topicReplyPaginationInput, setTopicReplyPaginationInput] = useState(
        defaultTopicReplyPaginationInput
    );
    const [changeStatusLoading, setChangeStatusLoading] = useState(false);
    const router = useRouter();

    const getListTopicReply = async () => {
        setTopicReplyPaginationInput((prev) => ({
            ...prev,
            loading: true,
        }));
        const res = await getTopicReplies({
            ...topicReplyPaginationInput,
            communityId: topic.communityId,
            topicId: topic.id!,
        });
        setTopicReplyPaginationInput((prev) => ({
            ...prev,
            loading: false,
            isFirst: false,
            totalPage: res.totalPage || 0,
        }));
        setReplyList(res.topicReplies);
    };

    useEffect(() => {
        getListTopicReply();
    }, [topicReplyPaginationInput.page]);

    return (
        <Box p={6} borderRadius={4} boxShadow="lg" bg="white" flexGrow={1}>
            <Flex align="center" justify="space-between">
                <Flex align="center">
                    <Text
                        as="span"
                        fontSize={14}
                        color="gray.400"
                        display="inline"
                    >
                        Tạo bởi{" "}
                        <Text
                            display="inline"
                            color="gray.600"
                            fontWeight={500}
                        >
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
                <HStack spacing={4}>
                    {user && user.uid === topic.creatorId && (
                        <Button
                            variant="outline"
                            isLoading={changeStatusLoading}
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
                    <Link
                        href={routes.getCommunityDetailPage(topic.communityId)}
                        _hover={{ textDecoration: "none" }}
                    >
                        <Button>Quay lại cộng đồng</Button>
                    </Link>
                </HStack>
            </Flex>
            <Text fontWeight={600} fontSize={20}>
                {topic.title}
            </Text>
            <Text whiteSpace="pre-line">{topic.description}</Text>
            {topic.imageUrl && (
                <Flex justify="center">
                    <AspectRatio ratio={4 / 3} w="50%">
                        <Image src={topic.imageUrl} borderRadius={4} />
                    </AspectRatio>
                </Flex>
            )}
            <Divider my={4} borderColor="gray.400" />
            <TopicReplyList
                topicReplyList={replyList}
                topicReplyPaginationInput={topicReplyPaginationInput}
                onNext={() =>
                    setTopicReplyPaginationInput((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                        isNext: true,
                    }))
                }
                onPrev={() =>
                    setTopicReplyPaginationInput((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                        isNext: false,
                    }))
                }
            />

            <Divider my={4} borderColor="gray.400" />
            {topic.isClose ? (
                <Flex
                    align="center"
                    justify="space-between"
                    borderRadius={2}
                    border="1px solid"
                    borderColor="gray.300"
                    p={4}
                >
                    <Text fontWeight={600}>Chủ đề này đã đóng</Text>
                </Flex>
            ) : user ? (
                <TopicReplyInput
                    topic={topic}
                    user={user}
                    onSubmit={async (topicReplyForm) => {
                        const res = await TopicService.reply({
                            topicReplyForm,
                            topic,
                        });
                        if (res) {
                            setReplyList((prev) => [res, ...prev]);
                        }
                    }}
                />
            ) : (
                <Flex
                    align="center"
                    justify="space-between"
                    borderRadius={2}
                    border="1px solid"
                    borderColor="gray.300"
                    p={4}
                >
                    <Text fontWeight={600}>
                        Bạn cần đăng nhập để có thể trả lời chủ đề này
                    </Text>
                </Flex>
            )}
        </Box>
    );
};
export default TopicItem;
