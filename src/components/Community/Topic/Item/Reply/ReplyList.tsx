import Pagination from "@/components/Pagination";
import { PaginationInput } from "@/hooks/usePagination";
import { TopicReply } from "@/models/Topic";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import React from "react";
import TopicReplyItem from "./ReplyItem";

type TopicReplyListProps = {
    topicReplyList: TopicReply[];
    topicReplyPaginationInput: PaginationInput;
    onNext: () => void;
    onPrev: () => void;
};

const TopicReplyList: React.FC<TopicReplyListProps> = ({
    topicReplyList,
    topicReplyPaginationInput,
    onNext,
    onPrev,
}) => {
    return (
        <>
            {topicReplyPaginationInput.loading ? (
                <Flex justify="center">
                    <Spinner />
                </Flex>
            ) : (
                <Box>
                    {topicReplyList.map((reply) => (
                        <Box key={reply.id} mb={4}>
                            <TopicReplyItem topicReply={reply} />
                        </Box>
                    ))}
                    <Box w="100%" mt={4}>
                        <Pagination
                            page={topicReplyPaginationInput.page}
                            totalPage={topicReplyPaginationInput.totalPage}
                            onNext={onNext}
                            onPrev={onPrev}
                        />
                    </Box>
                </Box>
            )}
        </>
    );
};
export default TopicReplyList;
