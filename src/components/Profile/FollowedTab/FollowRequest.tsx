import Pagination from "@/components/Pagination";
import { PaginationOutput } from "@/hooks/usePagination";
import { Follow, UserModel } from "@/models/User";
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import FollowRequestItem from "./FollowRequestItem";

type FollowRequestProps = {
    follower: UserModel;
    followPaginationOutput: PaginationOutput;
    loading: boolean;
    onNext: () => void;
    onPrev: () => void;
};

const FollowRequest: React.FC<FollowRequestProps> = ({
    follower,
    followPaginationOutput,
    loading,
    onNext,
    onPrev,
}) => {
    return (
        <Box w="100%">
            <Text mb={4} fontSize={20} fontWeight={500}>
                Yêu cầu theo dõi
            </Text>
            <VStack w="100%" spacing={4} mb={8}>
                {loading ? (
                    <Spinner />
                ) : followPaginationOutput.list.length > 0 ? (
                    followPaginationOutput.list.map((item: Follow) => (
                        <FollowRequestItem
                            key={item.id}
                            follow={item}
                            follower={follower}
                        />
                    ))
                ) : (
                    <Text>Không có yêu cầu theo dõi nào</Text>
                )}
            </VStack>
            <Pagination
                page={followPaginationOutput.page}
                totalPage={followPaginationOutput.totalPage}
                onNext={onNext}
                onPrev={onPrev}
            />
        </Box>
    );
};
export default FollowRequest;
