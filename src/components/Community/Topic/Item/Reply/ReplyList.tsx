import Pagination from "@/components/Pagination";
import { PaginationOutput } from "@/hooks/usePagination";
import { TopicReply } from "@/models/Topic";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import React from "react";
import TopicReplyItem from "./ReplyItem";

type TopicReplyListProps = {
    topicReplyPaginationOutput: PaginationOutput;
    loading: boolean;
    onNext: () => void;
    onPrev: () => void;
};

const TopicReplyList: React.FC<TopicReplyListProps> = ({
    topicReplyPaginationOutput,
    loading,
    onNext,
    onPrev,
}) => {
    return (
        <>
            {loading ? (
                <Flex justify="center">
                    <Spinner />
                </Flex>
            ) : (
                <Box>
                    {topicReplyPaginationOutput.list.map(
                        (reply: TopicReply) => (
                            <Box key={reply.id} mb={4}>
                                <TopicReplyItem topicReply={reply} />
                            </Box>
                        )
                    )}
                    <Box w="100%" mt={4}>
                        <Pagination
                            page={topicReplyPaginationOutput.page}
                            totalPage={topicReplyPaginationOutput.totalPage}
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
