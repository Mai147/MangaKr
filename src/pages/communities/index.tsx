import CommunitySnippetHorizontalItem from "@/components/Community/Snippet/CommunitySnippetHorizontalItem";
import SectionHeading from "@/components/Home/SectionHeading";
import PageContent from "@/components/Layout/PageContent";
import RightSidebar from "@/components/Layout/Sidebar/RightSidebar";
import Pagination from "@/components/Pagination";
import CircleHorizontalSkeleton from "@/components/Skeleton/CircleHorizontalSkeleton";
import { COMMUNITY_PAGE_COUNT } from "@/constants/pagination";
import useAuth from "@/hooks/useAuth";
import useTestPagination, {
    CommunityPaginationInput,
    defaultPaginationInput,
    defaultPaginationOutput,
    PaginationOutput,
} from "@/hooks/useTestPagination";
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
        mine: boolean;
    }>({
        related: false,
        top: false,
        mine: false,
    });
    const [communityPaginationInput, setCommunityPaginationInput] =
        useState<CommunityPaginationInput>({
            ...defaultPaginationInput,
            pageCount: COMMUNITY_PAGE_COUNT,
            setDocValue: (docValue) => {
                setCommunityPaginationInput((prev) => ({
                    ...prev,
                    docValue,
                }));
            },
        });
    const [communityPaginationOutput, setCommunityPaginationOutput] =
        useState<PaginationOutput>(defaultPaginationOutput);
    const { getCommunities } = useTestPagination();

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
        setLoading((prev) => ({
            ...prev,
            mine: true,
        }));
        const res = await getCommunities({
            ...communityPaginationInput,
            userId: userId,
        });
        if (res) {
            setCommunityPaginationInput((prev) => ({
                ...prev,
                isFirst: false,
            }));
            setCommunityPaginationOutput(res);
        }
        setLoading((prev) => ({
            ...prev,
            mine: false,
        }));
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
                setDocValue: (docValue) => {
                    setCommunityPaginationInput((prev) => ({
                        ...prev,
                        docValue,
                    }));
                },
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
                {loading.mine ? (
                    [1, 2, 3].map((e) => <CircleHorizontalSkeleton key={e} />)
                ) : communityPaginationOutput.list.length > 0 ? (
                    <>
                        <VStack w="100%" spacing={4}>
                            {communityPaginationOutput.list.map(
                                (community: Community) => (
                                    <Box w="100%" key={community.id}>
                                        <CommunitySnippetHorizontalItem
                                            community={community}
                                            w="100%"
                                        />
                                    </Box>
                                )
                            )}
                        </VStack>
                        <Flex align="center" justify="center" py={4} w="100%">
                            <Pagination
                                page={communityPaginationOutput.page}
                                totalPage={communityPaginationOutput.totalPage}
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
