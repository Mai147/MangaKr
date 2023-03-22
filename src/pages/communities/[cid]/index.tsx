import CommunityHeader from "@/components/Community/Header";
import NotAvailable from "@/components/Error/NotAvailable";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import useCommunity from "@/hooks/useCommunity";
import { Community } from "@/models/Community";
import ModelUtils from "@/utils/ModelUtils";
import { Box, Flex, Text } from "@chakra-ui/react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";

type CommunityDetailPageProps = {
    community: Community;
};

const CommunityDetailPage: React.FC<CommunityDetailPageProps> = ({
    community,
}) => {
    const { setSelectedCommunity } = useCommunity();

    useEffect(() => {
        setSelectedCommunity(community);
    }, [community]);

    if (!community) {
        return (
            <NotAvailable title="Cộng đồng này không tồn tại hoặc đã bị xóa!" />
        );
    }

    return (
        <Flex direction="column" flexGrow={1} bg="white" borderRadius={4}>
            <CommunityHeader community={community} />
            <Box bg="white" p={6}>
                {community.privacyType === "private" && (
                    <Text>Bạn cần tham gia cộng đồng này để xem bài viết</Text>
                )}
            </Box>
        </Flex>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { cid } = context.query;
    const community = await ModelUtils.getCommunity(cid as string);
    if (community) {
        return {
            props: {
                community,
            },
        };
    }
    return {
        props: {},
    };
}

export default CommunityDetailPage;
