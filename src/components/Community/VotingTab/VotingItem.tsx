import { routes } from "@/constants/routes";
import useVoting from "@/hooks/useVoting";
import { Voting } from "@/models/Vote";
import { isDateEnd } from "@/utils/StringUtils";
import {
    Avatar,
    Box,
    Button,
    Divider,
    Flex,
    HStack,
    Link,
    Spinner,
    Text,
} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import VotingOptionList from "./VotingOptionList";

type VotingItemProps = {
    voting: Voting;
};

const VotingItem: React.FC<VotingItemProps> = ({ voting }) => {
    const { votingAction, votingState } = useVoting();

    return (
        <Box p={6} borderRadius={4} boxShadow="lg" bg="white" flexGrow={1}>
            <Flex align="center" justify="space-between">
                <HStack align="center" spacing={4}>
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
                                {voting.creatorDisplayName}
                            </Text>
                        </Text>
                        <Avatar
                            src={
                                voting.creatorImageUrl || "/images/noImage.jpg"
                            }
                            size="sm"
                            ml={2}
                        />
                    </Flex>

                    {voting.createdAt && (
                        <Text color="gray.400" fontSize={14} ml={4}>
                            {moment(new Date(voting.createdAt.seconds * 1000))
                                .locale("vi")
                                .fromNow()}
                        </Text>
                    )}
                    {!isDateEnd(voting.timeLast) ? (
                        <Text color="gray.700" fontSize={14} fontWeight={500}>
                            Đến{" "}
                            {moment(
                                new Date(voting.timeLast.seconds * 1000)
                            ).format("HH:mm DD/MM/yyyy")}
                        </Text>
                    ) : (
                        <Text color="brand.100">
                            Cuộc bình chọn đã kết thúc
                        </Text>
                    )}
                </HStack>
                <HStack spacing={4}>
                    {/* {user && user.uid === voting.creatorId && (
                        <Button
                            variant="outline"
                            // isLoading={changeStatusLoading}
                            // onClick={async () => {
                            //     setChangeStatusLoading(true);
                            //     await TopicService.changeStatus({
                            //         isClose: !topic.isClose,
                            //         topic,
                            //     });
                            //     setChangeStatusLoading(false);
                            //     router.reload();
                            // }}
                        >
                            {voting.isClose
                                ? "Mở cuộc bình chọn"
                                : "Đóng cuộc bình chọn"}
                        </Button>
                    )} */}
                    <Link
                        href={routes.getCommunityDetailPage(voting.communityId)}
                        _hover={{ textDecoration: "none" }}
                    >
                        <Button>Quay lại cộng đồng</Button>
                    </Link>
                </HStack>
            </Flex>
            <Text>
                {votingState.selectedVoting?.voting.numberOfOptions || 0} lựa
                chọn
            </Text>
            <Text>
                {votingState.selectedVoting?.voting.numberOfVotes || 0} lượt
                bình chọn
            </Text>
            <Divider my={4} />
            <Text fontWeight={600} fontSize={20} whiteSpace="pre-line">
                {voting.content}
            </Text>
            <Divider my={4} borderColor="gray.400" />
            {votingState.loading.getVotingOptions ? (
                <Flex align="center" justify="center" py={4}>
                    <Spinner />
                </Flex>
            ) : (
                votingState.loading.getVotingOptions !== undefined && (
                    <VotingOptionList />
                )
            )}
        </Box>
    );
};
export default VotingItem;
