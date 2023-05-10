import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import useCommunity from "@/hooks/useCommunity";
import CommunityService from "@/services/CommunityService";
import { Icon, Button, Flex, Box, Link, Divider } from "@chakra-ui/react";
import React, { useMemo } from "react";
import {
    AiOutlineCheckCircle,
    AiOutlineUserAdd,
    AiOutlineUsergroupAdd,
} from "react-icons/ai";
import { BsFillFileEarmarkPostFill } from "react-icons/bs";
import { FiMoreVertical } from "react-icons/fi";
import { MdOutlineHowToVote } from "react-icons/md";
import { VscPreview } from "react-icons/vsc";

type CommunityLeftSideBarActionProps = {};

const CommunityLeftSideBarAction: React.FC<
    CommunityLeftSideBarActionProps
> = ({}) => {
    const { communityState } = useCommunity();
    const { user } = useAuth();

    const checkApprovePostAuthorize = () => {
        if (communityState.selectedCommunity) {
            return CommunityService.canApprovePost({
                communityType: communityState.selectedCommunity.privacyType,
                userRole: communityState.userCommunityRole?.role,
                user,
            });
        }
    };

    const checkApproveUserAuthorize = () => {
        if (communityState.selectedCommunity) {
            return CommunityService.canApproveUser({
                communityType: communityState.selectedCommunity.privacyType,
                userRole: communityState.userCommunityRole?.role,
                user,
            });
        }
    };

    const checkAuthorizeUserAuthorize = () => {
        if (communityState.selectedCommunity) {
            return CommunityService.canAuthorize({
                communityType: communityState.selectedCommunity.privacyType,
                userRole: communityState.userCommunityRole?.role,
                user,
            });
        }
    };

    const checkCreatePostAuthorize = () => {
        if (communityState.selectedCommunity) {
            return CommunityService.canCreatePosts({
                communityType: communityState.selectedCommunity.privacyType,
                userRole: communityState.userCommunityRole?.role,
                user,
            });
        }
    };

    const canApprovePost = useMemo(
        () => checkApprovePostAuthorize(),
        [
            communityState.selectedCommunity,
            user,
            communityState.userCommunityRole?.role,
        ]
    );

    const canApproveUser = useMemo(
        () => checkApproveUserAuthorize(),
        [
            communityState.selectedCommunity,
            user,
            communityState.userCommunityRole?.role,
        ]
    );

    const canAuthorizeUser = useMemo(
        () => checkAuthorizeUserAuthorize(),
        [
            communityState.selectedCommunity,
            user,
            communityState.userCommunityRole?.role,
        ]
    );

    const canCreatePost = useMemo(
        () => checkCreatePostAuthorize(),
        [
            communityState.selectedCommunity,
            user,
            communityState.userCommunityRole?.role,
        ]
    );

    return canApprovePost ||
        canApproveUser ||
        canAuthorizeUser ||
        canCreatePost ? (
        <Box position="relative" role="group" alignSelf="flex-end">
            <Icon
                as={FiMoreVertical}
                color="gray.700"
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
                zIndex={10}
                _groupHover={{ opacity: 1, visibility: "visible" }}
            >
                {canApprovePost && (
                    <Link
                        _hover={{ textDecoration: "none" }}
                        href={routes.getCommunityApprovePage(
                            communityState.selectedCommunity?.id!
                        )}
                    >
                        <Button variant="unstyled">
                            <Flex align="center">
                                Phê duyệt bài viết
                                <Icon
                                    as={AiOutlineCheckCircle}
                                    fontSize={18}
                                    ml={1}
                                    color="green.400"
                                />
                            </Flex>
                        </Button>
                    </Link>
                )}
                {canApproveUser && (
                    <Link
                        _hover={{ textDecoration: "none" }}
                        href={routes.getCommunityUserApprovePage(
                            communityState.selectedCommunity?.id!
                        )}
                    >
                        <Button variant="unstyled">
                            <Flex align="center">
                                Phê duyệt thành viên
                                <Icon
                                    as={AiOutlineUserAdd}
                                    fontSize={18}
                                    ml={1}
                                    color="secondary.400"
                                />
                            </Flex>
                        </Button>
                    </Link>
                )}
                {canAuthorizeUser && (
                    <Link
                        _hover={{ textDecoration: "none" }}
                        href={routes.getCommunityUserAuthorizePage(
                            communityState.selectedCommunity?.id!
                        )}
                    >
                        <Button variant="unstyled">
                            <Flex align="center">
                                Thêm cộng tác viên
                                <Icon
                                    as={AiOutlineUsergroupAdd}
                                    fontSize={18}
                                    ml={1}
                                    color="brand.400"
                                />
                            </Flex>
                        </Button>
                    </Link>
                )}
                <Divider />
                {canCreatePost && (
                    <>
                        <Link
                            _hover={{ textDecoration: "none" }}
                            href={routes.getCommunityTopicCreatePage(
                                communityState.selectedCommunity?.id!
                            )}
                        >
                            <Button variant="unstyled">
                                <Flex align="center">
                                    Tạo chủ đề
                                    <Icon
                                        as={VscPreview}
                                        fontSize={18}
                                        ml={1}
                                    />
                                </Flex>
                            </Button>
                        </Link>
                        <Link
                            _hover={{ textDecoration: "none" }}
                            href={routes.getCommunityPostCreatePage(
                                communityState.selectedCommunity?.id!
                            )}
                        >
                            <Button variant="unstyled">
                                <Flex align="center">
                                    Tạo bài viết
                                    <Icon
                                        as={BsFillFileEarmarkPostFill}
                                        fontSize={18}
                                        ml={1}
                                    />
                                </Flex>
                            </Button>
                        </Link>
                        <Link
                            _hover={{ textDecoration: "none" }}
                            href={routes.getCommunityVotingCreatePage(
                                communityState.selectedCommunity?.id!
                            )}
                        >
                            <Button variant="unstyled">
                                <Flex align="center">
                                    Tạo cuộc bình chọn
                                    <Icon
                                        as={MdOutlineHowToVote}
                                        fontSize={18}
                                        ml={1}
                                    />
                                </Flex>
                            </Button>
                        </Link>
                    </>
                )}
            </Box>
        </Box>
    ) : (
        <></>
    );
};
export default CommunityLeftSideBarAction;
