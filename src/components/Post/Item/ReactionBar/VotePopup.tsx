import { PostVote, Vote } from "@/models/Vote";
import { Box, Flex, HStack, Icon } from "@chakra-ui/react";
import React, { useState } from "react";
import { RiEmotionHappyLine } from "react-icons/ri";
import ReactionItem from "./ReactionItem";

type VotePopupProps = {
    voteList: PostVote[] | Vote[];
    userVoteValue?: PostVote | Vote | undefined;
    onVote: (value: PostVote | Vote) => Promise<void>;
    triggerIconSize?: number;
};

const VotePopup: React.FC<VotePopupProps> = ({
    voteList,
    userVoteValue,
    onVote,
    triggerIconSize = 26,
}) => {
    const [loading, setLoading] = useState(false);
    const [selectedReaction, setSelectedReaction] = useState<
        PostVote | undefined
    >();
    return (
        <Box position="relative" role="group">
            <Flex align="center" justify="center">
                <Icon
                    as={RiEmotionHappyLine}
                    fontSize={triggerIconSize}
                    cursor="pointer"
                />
            </Flex>
            <Box
                position="absolute"
                bottom={`calc(100% + 16px)`}
                left={-4}
                bg="white"
                p={4}
                borderRadius={4}
                boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
                _before={{
                    content: '""',
                    position: "absolute",
                    top: "100%",
                    left: 4,
                    w: 0,
                    h: 0,
                    borderLeft: "12px solid transparent",
                    borderRight: "12px solid transparent",
                    borderTop: "12px solid white",
                    filter: "drop-shadow(3px 3px 2px rgba(0,0,0,0.25))",
                }}
                _after={{
                    content: '""',
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    w: "100%",
                    h: "24px",
                    bg: "transparent",
                }}
                opacity={0}
                visibility="hidden"
                _groupHover={{ opacity: 1, visibility: "visible" }}
                transition="all 0.3s"
            >
                <HStack spacing={6} fontSize={24}>
                    {voteList.map((e, idx) => (
                        <ReactionItem
                            key={idx}
                            icon={e.icon}
                            color={e.color}
                            isActive={userVoteValue?.value === e.value}
                            isLoading={loading && e === selectedReaction}
                            isDisabled={loading}
                            value={e}
                            onClick={async (value) => {
                                setLoading(true);
                                setSelectedReaction(e);
                                await onVote(value);
                                setLoading(false);
                            }}
                        />
                    ))}
                </HStack>
            </Box>
        </Box>
    );
};
export default VotePopup;
