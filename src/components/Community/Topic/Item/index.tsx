import { REPLY_TOPIC_PAGE_COUNT } from "@/constants/pagination";
import useAuth from "@/hooks/useAuth";
import usePagination, {
    defaultPaginationInput,
    defaultPaginationOutput,
    PaginationOutput,
    TopicReplyPaginationInput,
} from "@/hooks/usePagination";
import { Topic } from "@/models/Topic";
import TopicService from "@/services/TopicService";
import { AspectRatio, Box, Divider, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import TopicReplyList from "./Reply/ReplyList";
import TopicReplyInput from "./Reply/TopicReplyInput";
import TopicItemHeader from "./TopicHeader";

type TopicItemProps = {
    topic: Topic;
};

const TopicItem: React.FC<TopicItemProps> = ({ topic }) => {
    const { user } = useAuth();
    const { getTopicReplies } = usePagination();
    const [topicReplyPaginationInput, setTopicReplyPaginationInput] =
        useState<TopicReplyPaginationInput>({
            ...defaultPaginationInput,
            communityId: topic.communityId,
            topicId: topic.id!,
            pageCount: REPLY_TOPIC_PAGE_COUNT,
            setDocValue: (docValue) => {
                setTopicReplyPaginationInput((prev) => ({
                    ...prev,
                    docValue,
                }));
            },
        });
    const [topicReplyPaginationOutput, setTopicReplyPaginationOutput] =
        useState<PaginationOutput>(defaultPaginationOutput);
    const [getTopicReplyLoading, setGetTopicReplyLoading] = useState(false);

    const getListTopicReply = async () => {
        setGetTopicReplyLoading(true);
        const res = await getTopicReplies(topicReplyPaginationInput);
        if (res) {
            setTopicReplyPaginationOutput(res);
            setTopicReplyPaginationInput((prev) => ({
                ...prev,
                isFirst: false,
            }));
        }
        setGetTopicReplyLoading(false);
    };

    useEffect(() => {
        getListTopicReply();
    }, [topicReplyPaginationInput.page]);

    return (
        <Box p={6} borderRadius={4} boxShadow="lg" bg="white" flexGrow={1}>
            <TopicItemHeader topic={topic} />
            <Divider my={4} />
            <Text fontWeight={600} fontSize={20}>
                {topic.title}
            </Text>
            <Text whiteSpace="pre-line">{topic.description}</Text>
            {topic.imageUrl && (
                <Flex justify="center" mt={4}>
                    <AspectRatio ratio={4 / 3} w="50%">
                        <Image src={topic.imageUrl} borderRadius={4} />
                    </AspectRatio>
                </Flex>
            )}
            <Divider my={4} borderColor="gray.400" />
            <TopicReplyList
                topicReplyPaginationOutput={topicReplyPaginationOutput}
                loading={getTopicReplyLoading}
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
                            setTopicReplyPaginationOutput((prev) => ({
                                ...prev,
                                list: [...prev.list, res],
                            }));
                            setTopicReplyPaginationInput((prev) => ({
                                ...prev,
                                exceptionCount: (prev.exceptionCount || 0) + 1,
                            }));
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
