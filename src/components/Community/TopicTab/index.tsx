import InfiniteScroll from "@/components/InfiniteScroll";
import Pagination from "@/components/Pagination";
import useCommunity from "@/hooks/useCommunity";
import {
    Box,
    Input,
    InputGroup,
    InputLeftElement,
    Spinner,
    Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import TopicSnippet from "../Topic/TopicSnippet";

type CommunityTopicTabProps = {};

const CommunityTopicTab: React.FC<CommunityTopicTabProps> = () => {
    const { communityState } = useCommunity();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (communityState.communityTopicPagination?.state) {
            setLoading(communityState.communityTopicPagination.state.loading);
        }
    }, [communityState.communityTopicPagination?.state.loading]);

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
                        value={
                            communityState.communityTopicPagination?.searchValue
                        }
                        onChange={(e) =>
                            communityState.communityTopicPagination?.setSearchValue(
                                e.target.value
                            )
                        }
                    />
                </InputGroup>
            </Box>
            {communityState.communityTopicPagination?.state.loading ? (
                <Spinner my={4} />
            ) : communityState.communityTopics &&
              communityState.communityTopics.length > 0 ? (
                <>
                    {communityState.communityTopics?.map((topic) => (
                        <Box key={topic.id} w="100%" mb={8}>
                            <TopicSnippet topic={topic} />
                        </Box>
                    ))}
                    <Pagination
                        page={
                            communityState.communityTopicPagination?.state
                                .page || 0
                        }
                        totalPage={
                            communityState.communityTopicPagination?.state
                                .totalPage || 0
                        }
                        onNext={
                            communityState.communityTopicPagination?.onNext!
                        }
                        onPrev={() => {}}
                    />
                </>
            ) : (
                <Text>Chưa có chủ đề nào</Text>
            )}
        </>
    );
};
export default CommunityTopicTab;
