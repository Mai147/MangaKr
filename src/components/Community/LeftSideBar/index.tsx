import ConfirmModal from "@/components/Modal/ConfirmModal";
import { COMMUNITY_SUPER_ADMIN_ROLE } from "@/constants/roles";
import useAuth from "@/hooks/useAuth";
import useCommunity from "@/hooks/useCommunity";
import useModal from "@/hooks/useModal";
import CommunityService from "@/services/CommunityService";
import { Box, Button, Divider, Flex, Icon, Text } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { BiMessageSquareAdd } from "react-icons/bi";
import { VscSignOut } from "react-icons/vsc";
import CommunitySnippetHorizontalBasicItem from "../Snippet/CommunitySnippetHorizontalBasicItem";
import CommunityLeftSideBarAction from "./Action";
import CommunityLeftSideBarImage from "./Image";
import CommunityLeftSideBarInfo from "./Info";

type CommunityLeftSideBarProps = {};

const CommunityLeftSideBar: React.FC<CommunityLeftSideBarProps> = () => {
    const { communityState, communityAction } = useCommunity();
    const [joinLoading, setJoinLoading] = useState(false);
    const { user } = useAuth();
    const { toggleView, closeModal } = useModal();

    const checkUpdateAuthorize = () => {
        if (communityState.selectedCommunity) {
            return CommunityService.canUpdateCommunnity({
                communityType: communityState.selectedCommunity.privacyType,
                userRole: communityState.userCommunityRole?.role,
                user,
            });
        }
    };

    const canEdit = useMemo(
        () => checkUpdateAuthorize(),
        [communityState.selectedCommunity, user]
    );

    return (
        <Flex
            py={2}
            boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
            borderRadius={8}
            direction="column"
        >
            <Box position="relative" alignSelf="flex-end" top={2} right={2}>
                <CommunityLeftSideBarAction />
            </Box>

            <ConfirmModal
                title="Rời khỏi cộng đồng"
                content="Bạn chắc chắn muốn rời khỏi cộng đồng?"
                subContent={
                    communityState.userCommunityRole?.role ===
                    COMMUNITY_SUPER_ADMIN_ROLE
                        ? "Bạn hiện đang là SuperAdmin. Quyền SuperAdmin sẽ được chuyển cho thành viên có cấp độ cao nhất và tham gia sớm nhất dưới bạn. Bạn có thể thay đổi SuperAdmin trong phần Thêm cộng tác viên."
                        : ""
                }
                onSubmit={async () => {
                    setJoinLoading(true);
                    await communityAction.leaveCommunity();
                    closeModal();
                    setJoinLoading(false);
                }}
            />
            <Flex
                direction="column"
                align="center"
                p={6}
                maxH="calc(100vh - 150px)"
                overflow="auto"
                className="scroll is-hover"
            >
                <Flex direction="column" align="center" w="100%">
                    <Flex w="100%" align="center" direction="column">
                        <CommunityLeftSideBarImage canEdit={canEdit} />
                        <CommunityLeftSideBarInfo canEdit={canEdit} />
                    </Flex>
                    <Divider my={4} />
                    <Box w="100%">
                        <Text fontWeight={500}>Cộng đồng liên quan</Text>
                        {communityState.relatedCommunities &&
                        communityState.relatedCommunities.length > 0 ? (
                            communityState.relatedCommunities?.map((c) => (
                                <CommunitySnippetHorizontalBasicItem
                                    key={c.id}
                                    community={c}
                                    my={2}
                                />
                            ))
                        ) : (
                            <Text fontSize={14} color="gray.400">
                                Chưa có cộng đồng liên quan nào!
                            </Text>
                        )}
                    </Box>
                    <Divider my={4} />
                    {communityState.userCommunityRole?.isAccept === false ? (
                        <Text>Đã yêu cầu tham gia</Text>
                    ) : communityState.userCommunityRole ? (
                        <Button
                            variant="outline"
                            w="100%"
                            isLoading={joinLoading}
                        >
                            <Flex
                                align="center"
                                onClick={() => {
                                    toggleView("confirmModal");
                                }}
                            >
                                Rời khỏi cộng đồng
                                <Icon as={VscSignOut} fontSize={18} ml={1} />
                            </Flex>
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            w="100%"
                            isLoading={joinLoading}
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
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};
export default CommunityLeftSideBar;
