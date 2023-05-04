import { votingHeaderList } from "@/components/Community/Approve/CommunityInfoApprove";
import { Voting } from "@/models/Vote";
import { Flex, HStack, Text } from "@chakra-ui/react";
import moment from "moment";
import React, { useState } from "react";
import VotingItemPreview from "./VotingPreview";

type VotingHorizontalSnippetItemProps = {
    voting: Voting;
};

const VotingHorizontalSnippetItem: React.FC<
    VotingHorizontalSnippetItemProps
> = ({ voting }) => {
    const [showPreview, setShowPreview] = useState(false);
    return (
        <Flex
            justify="space-between"
            align="center"
            w="100%"
            p={4}
            _hover={{ bg: "gray.50" }}
            transition="all 0.3s"
            cursor="pointer"
            onClick={() => setShowPreview(true)}
        >
            {showPreview && (
                <VotingItemPreview
                    voting={voting}
                    onHidden={() => {
                        setShowPreview(false);
                    }}
                />
            )}
            <HStack spacing={4} flexGrow={1}>
                <Text w={votingHeaderList[0].width} flexShrink={0}>
                    {voting.creatorDisplayName}
                </Text>
                <Text w={votingHeaderList[1].width} flexShrink={0}>
                    {moment(new Date(voting.timeLast.seconds * 1000)).format(
                        "HH:mm - DD/MM/yyyy "
                    )}
                </Text>

                <Text flexGrow={1} noOfLines={3} whiteSpace="pre-line">
                    {voting.content}
                </Text>
            </HStack>
        </Flex>
    );
};
export default VotingHorizontalSnippetItem;
