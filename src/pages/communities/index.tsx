import CommunitySnippetHorizontalItem from "@/components/Community/Snippet/CommunitySnippetHorizontalItem";
import SectionHeading from "@/components/Home/SectionHeading";
import PageContent from "@/components/Layout/PageContent";
import RightSidebar from "@/components/Layout/Sidebar/RightSidebar";
import Pagination from "@/components/Pagination";
import CircleHorizontalSkeleton from "@/components/Skeleton/CircleHorizontalSkeleton";
import { COMMUNITY_PAGE_COUNT } from "@/constants/pagination";
import useAuth from "@/hooks/useAuth";
import usePagination, {
    defaultPaginationInput,
    PaginationInput,
} from "@/hooks/usePagination";
import { Community } from "@/models/Community";
import CommunityService from "@/services/CommunityService";
import { Box, Divider, Flex, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

type CommunityPageProps = {};

const CommunityPage: React.FC<CommunityPageProps> = () => {
    const { user, setNeedAuth } = useAuth();
    const [communities, setCommunities] = useState<{
        related: Community[];
        top: Community[];
        mine: Community[];
    }>({
        related: [],
        top: [],
        mine: [],
    });
    const [loading, setLoading] = useState<{
        related: boolean;
        top: boolean;
    }>({
        related: false,
        top: false,
    });
    const [communityPaginationInput, setCommunityPaginationInput] =
        useState<PaginationInput>({
            ...defaultPaginationInput,
            pageCount: COMMUNITY_PAGE_COUNT,
        });
    const { getCommunities } = usePagination();

    const getRelatedCommunities = async (userId: string) => {
        setLoading((prev) => ({
            ...prev,
            related: true,
        }));
        const communities = await CommunityService.getUserRelated({ userId });
        setCommunities((prev) => ({
            ...prev,
            related: communities,
        }));
        setLoading((prev) => ({
            ...prev,
            related: false,
        }));
    };

    const getTopCommunities = async () => {
        setLoading((prev) => ({
            ...prev,
            top: true,
        }));
        const communities = await CommunityService.getAll({
            communityOrders: [
                {
                    communityOrderBy: "numberOfMembers",
                    communityOrderDirection: "desc",
                },
            ],
        });
        setCommunities((prev) => ({
            ...prev,
            top: communities,
        }));
        setLoading((prev) => ({
            ...prev,
            top: false,
        }));
    };

    const getMyCommunities = async (userId: string) => {
        setCommunityPaginationInput((prev) => ({
            ...prev,
            loading: true,
        }));
        const res = await getCommunities({
            ...communityPaginationInput,
            userId: userId,
        });
        if (res.communities) {
            setCommunities((prev) => ({
                ...prev,
                mine: res.communities,
            }));
            setCommunityPaginationInput((prev) => ({
                ...prev,
                loading: false,
                totalPage: res.totalPage || 0,
                isFirst: false,
            }));
        }
    };

    useEffect(() => {
        if (user) {
            getMyCommunities(user.uid);
        }
    }, [communityPaginationInput.page, user]);

    useEffect(() => {
        if (user) {
            getRelatedCommunities(user.uid);
            getTopCommunities();
            setCommunityPaginationInput({
                ...defaultPaginationInput,
                pageCount: COMMUNITY_PAGE_COUNT,
            });
        }
    }, [user]);

    useEffect(() => {
        setNeedAuth(false);
    }, []);

    return (
        <PageContent>
            <VStack spacing={2} align="flex-start">
                <SectionHeading title="Bạn có thể thích" />
                {loading.related ? (
                    [1, 2, 3].map((e) => <CircleHorizontalSkeleton key={e} />)
                ) : communities.related.length > 0 ? (
                    <VStack w="100%" spacing={4}>
                        {communities.related.map((community) => (
                            <Box w="100%" key={community.id}>
                                <CommunitySnippetHorizontalItem
                                    community={community}
                                    w="100%"
                                />
                            </Box>
                        ))}
                    </VStack>
                ) : (
                    <Text>Không có cộng đồng nào</Text>
                )}
                <Divider py={4} borderColor="gray.400" />
                <SectionHeading title="Cộng đồng nổi bật" />
                {loading.top ? (
                    [1, 2, 3].map((e) => <CircleHorizontalSkeleton key={e} />)
                ) : communities.top.length > 0 ? (
                    <VStack w="100%" spacing={4}>
                        {communities.top.map((community) => (
                            <Box w="100%" key={community.id}>
                                <CommunitySnippetHorizontalItem
                                    community={community}
                                    w="100%"
                                />
                            </Box>
                        ))}
                    </VStack>
                ) : (
                    <Text>Không có cộng đồng nào</Text>
                )}
                <Divider py={4} borderColor="gray.400" />
                <SectionHeading title="Cộng đồng của bạn" />
                {communityPaginationInput.loading ? (
                    [1, 2, 3].map((e) => <CircleHorizontalSkeleton key={e} />)
                ) : communities.mine.length > 0 ? (
                    <>
                        <VStack w="100%" spacing={4}>
                            {communities.mine.map((community) => (
                                <Box w="100%" key={community.id}>
                                    <CommunitySnippetHorizontalItem
                                        community={community}
                                        w="100%"
                                    />
                                </Box>
                            ))}
                        </VStack>
                        <Flex align="center" justify="center" py={4} w="100%">
                            <Pagination
                                page={communityPaginationInput.page}
                                totalPage={communityPaginationInput.totalPage}
                                onNext={() =>
                                    setCommunityPaginationInput((prev) => ({
                                        ...prev,
                                        page: prev.page + 1,
                                        isNext: true,
                                    }))
                                }
                                onPrev={() => {
                                    setCommunityPaginationInput((prev) => ({
                                        ...prev,
                                        page: prev.page - 1,
                                        isNext: false,
                                    }));
                                }}
                            />
                        </Flex>
                    </>
                ) : (
                    <Text>Bạn chưa tham gia cộng đồng nào</Text>
                )}
            </VStack>
            <RightSidebar />
        </PageContent>
    );
};
export default CommunityPage;
