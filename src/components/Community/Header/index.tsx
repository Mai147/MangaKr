import Tag from "@/components/Tag";
import { routes } from "@/constants/routes";
import useCommunity from "@/hooks/useCommunity";
import { Community } from "@/models/Community";
import {
    Flex,
    Avatar,
    VStack,
    Text,
    Box,
    Link,
    HStack,
} from "@chakra-ui/react";
import React from "react";

type CommunityHeaderProps = {
    community: Community;
};

const CommunityHeader: React.FC<CommunityHeaderProps> = ({ community }) => {
    const { communityState } = useCommunity();

    return (
        <Flex
            w="100%"
            bg={
                community.privacyType === "public"
                    ? "blue.300"
                    : community.privacyType === "restricted"
                    ? "brand.400"
                    : "gray.800"
            }
            p={6}
            borderTopLeftRadius={4}
            borderTopRightRadius={4}
            justify="space-between"
            align="flex-start"
        >
            <Flex
                align="center"
                direction={{ base: "column", sm: "row" }}
                w="100%"
            >
                <Avatar
                    src={
                        communityState.selectedCommunity?.imageUrl ||
                        "/images/noImage.jpg"
                    }
                    size="xl"
                    mb={{ base: 4, sm: 0 }}
                />
                <Flex align="flex-end" w="100%">
                    <VStack
                        align={{ base: "center", sm: "flex-start" }}
                        ml={4}
                        mr={8}
                        w="100%"
                        spacing={4}
                    >
                        <HStack>
                            <Text
                                fontSize={20}
                                fontWeight={600}
                                color="white"
                                lineHeight={1}
                            >
                                {communityState.selectedCommunity?.name}
                            </Text>
                            <Text color="white">-</Text>
                            <Tag
                                label={
                                    communityState.selectedCommunity
                                        ?.bookName || ""
                                }
                            />
                        </HStack>
                        <Text fontSize={14} color="gray.200" lineHeight={1}>
                            {communityState.selectedCommunity
                                ?.numberOfMembers || 0}{" "}
                            thành viên
                        </Text>
                        <Flex align="flex-end" alignSelf="flex-start">
                            <Text color="white" mr="2">
                                Quản trị viên:
                            </Text>
                            <Box position="relative" h="8">
                                {communityState.selectedCommunityModerators?.map(
                                    (mod, idx) => {
                                        if (idx < 3) {
                                            return (
                                                <Link
                                                    position="absolute"
                                                    top={0}
                                                    left={`calc(24px * ${idx})`}
                                                    href={routes.getProfilePage(
                                                        mod.id
                                                    )}
                                                    key={idx}
                                                >
                                                    <Avatar
                                                        key={mod.id}
                                                        size="sm"
                                                        src={
                                                            mod.imageUrl ||
                                                            "/images.noImage.jpg"
                                                        }
                                                        border={`1px solid ${
                                                            community.privacyType ===
                                                            "public"
                                                                ? "#63b3ed"
                                                                : community.privacyType ===
                                                                  "restricted"
                                                                ? "#e74c3c"
                                                                : "white"
                                                        }`}
                                                        zIndex={idx}
                                                    />
                                                </Link>
                                            );
                                        }
                                        return <div key={idx}></div>;
                                    }
                                )}
                                {(
                                    communityState.selectedCommunityModerators ||
                                    []
                                ).length > 3 && (
                                    <Flex
                                        w="8"
                                        h="8"
                                        borderRadius="full"
                                        position="absolute"
                                        align="center"
                                        justify="center"
                                        bg="gray.100"
                                        fontSize={10}
                                        fontWeight={500}
                                        top={0}
                                        left={`calc(24px * 3 - 6px)`}
                                        zIndex={4}
                                    >
                                        +
                                        {(
                                            communityState.selectedCommunityModerators ||
                                            []
                                        ).length - 3}
                                    </Flex>
                                )}
                            </Box>
                        </Flex>
                    </VStack>
                </Flex>
            </Flex>
        </Flex>
    );
};
export default CommunityHeader;
