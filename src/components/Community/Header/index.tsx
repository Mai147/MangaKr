import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import useCommunity from "@/hooks/useCommunity";
import { Community } from "@/models/Community";
import CommunityService from "@/services/CommunityService";
import {
    Flex,
    Avatar,
    VStack,
    Box,
    Text,
    Icon,
    Button,
    Link,
    Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BiMessageSquareAdd } from "react-icons/bi";
import { FiMoreVertical } from "react-icons/fi";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { VscSignOut } from "react-icons/vsc";

type CommunityHeaderProps = {
    community: Community;
};

const CommunityHeader: React.FC<CommunityHeaderProps> = ({ community }) => {
    const { communityState, communityAction } = useCommunity();
    const [joinLoading, setJoinLoading] = useState(false);
    const { user } = useAuth();

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
            <Flex align="center">
                <Avatar
                    src={
                        communityState.selectedCommunity?.imageUrl ||
                        "/images/noImage.jpg"
                    }
                    size="xl"
                />
                <Flex align="flex-end">
                    <VStack align="flex-start" ml={4} mr={8}>
                        <Text
                            fontSize={20}
                            fontWeight={600}
                            color="white"
                            lineHeight={1}
                        >
                            {communityState.selectedCommunity?.name}
                        </Text>
                        <Text fontSize={14} color="gray.200" lineHeight={1}>
                            {communityState.selectedCommunity
                                ?.numberOfMembers || 0}{" "}
                            thành viên
                        </Text>
                    </VStack>
                </Flex>
            </Flex>
            <Box position="relative" role="group">
                <Icon
                    as={FiMoreVertical}
                    color="white"
                    fontSize={24}
                    cursor="pointer"
                />
                <Box
                    position="absolute"
                    top={4}
                    right={4}
                    px={4}
                    bg="white"
                    boxShadow="md"
                    borderRadius={4}
                    opacity={0}
                    visibility="hidden"
                    _groupHover={{ opacity: 1, visibility: "visible" }}
                >
                    {joinLoading ? (
                        <Flex align="center" justify="center" w="100%" py={2}>
                            <Spinner size="sm" />
                        </Flex>
                    ) : (
                        communityState.userCommunityRole?.isAccept !== false &&
                        (communityState.userCommunityRole?.role ? (
                            <Button variant="unstyled">
                                <Flex align="center">
                                    Rời khỏi cộng đồng
                                    <Icon
                                        as={VscSignOut}
                                        fontSize={18}
                                        ml={1}
                                    />
                                </Flex>
                            </Button>
                        ) : (
                            <Button
                                variant="unstyled"
                                onClick={async () => {
                                    setJoinLoading(true);
                                    await communityAction.joinCommunity();
                                    setJoinLoading(false);
                                }}
                            >
                                <Flex align="center">
                                    Yêu cầu tham gia
                                    <Icon
                                        as={BiMessageSquareAdd}
                                        fontSize={18}
                                        ml={1}
                                    />
                                </Flex>
                            </Button>
                        ))
                    )}
                    {CommunityService.canCreatePosts({
                        communityType: community.privacyType,
                        userRole: communityState.userCommunityRole?.role,
                        user,
                    }) && (
                        <Link
                            _hover={{ textDecoration: "none" }}
                            href={routes.getCommunityPostCreatePage(
                                community.id!
                            )}
                        >
                            <Button variant="unstyled">
                                <Flex align="center">
                                    Tạo bài viết
                                    <Icon
                                        as={MdOutlineAddToPhotos}
                                        fontSize={18}
                                        ml={1}
                                    />
                                </Flex>
                            </Button>
                        </Link>
                    )}
                </Box>
            </Box>
        </Flex>
    );
};
export default CommunityHeader;
