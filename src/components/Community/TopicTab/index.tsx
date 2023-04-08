import Pagination from "@/components/Pagination";
import useCommunity from "@/hooks/useCommunity";
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
    const { communityState, communityAction } = useCommunity();

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
                        value={communityState.topic.input.searchValue || ""}
                        onChange={(e) =>
                            communityAction.searchTopic(e.target.value)
                        }
                    />
                </InputGroup>
            </Box>
            {communityState.topic.loading ? (
                <Spinner my={4} />
            ) : communityState.topic.output.list &&
              communityState.topic.output.list.length > 0 ? (
                <>
                    {communityState.topic.output.list.map((topic: Topic) => (
                        <Box key={topic.id} w="100%" mb={8}>
                            <TopicSnippet topic={topic} />
                        </Box>
                    ))}
                    <Pagination
                        page={communityState.topic.output.page || 0}
                        totalPage={communityState.topic.output.totalPage || 0}
                        onNext={communityAction.onNextTopic}
                        onPrev={communityAction.onPrevTopic}
                    />
                </>
            ) : (
                <Text>Chưa có chủ đề nào</Text>
            )}
        </>
    );
};
export default CommunityTopicTab;
