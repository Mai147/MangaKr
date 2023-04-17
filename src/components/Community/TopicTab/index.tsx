import Pagination from "@/components/Pagination";
import useTopic from "@/hooks/useTopic";
import { Topic } from "@/models/Topic";
import {
    Box,
    Input,
    InputGroup,
    InputLeftElement,
    Spinner,
    Text,
} from "@chakra-ui/react";
import React from "react";
import { FiSearch } from "react-icons/fi";
import TopicSnippet from "../Topic/TopicSnippet";

type CommunityTopicTabProps = {};

const CommunityTopicTab: React.FC<CommunityTopicTabProps> = () => {
    const { topicAction, topicState } = useTopic();

    return (
        <>
            <Box
                mb={4}
                position="sticky"
                top={40}
                left={0}
                bg="white"
                zIndex={999}
                w={"calc(100% + 36px)"}
                pb={4}
            >
                <InputGroup>
                    <InputLeftElement
                        pointerEvents="none"
                        children={<FiSearch color="gray.300" />}
                    />
                    <Input
                        type="text"
                        placeholder="Tìm kiếm chủ đề..."
                        borderColor="gray.400"
                        value={topicState.input.searchValue || ""}
                        onChange={(e) => topicAction.search(e.target.value)}
                    />
                </InputGroup>
            </Box>
            {topicState.loading.getTopics ? (
                <Spinner my={4} />
            ) : topicState.output.list && topicState.output.list.length > 0 ? (
                <>
                    {topicState.output.list.map((topic: Topic) => (
                        <Box key={topic.id} w="100%" mb={8}>
                            <TopicSnippet topic={topic} />
                        </Box>
                    ))}
                    <Pagination
                        page={topicState.output.page || 0}
                        totalPage={topicState.output.totalPage || 0}
                        onNext={topicAction.onNext}
                        onPrev={topicAction.onPrev}
                    />
                </>
            ) : (
                <Text>Chưa có chủ đề nào</Text>
            )}
        </>
    );
};
export default CommunityTopicTab;
