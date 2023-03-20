import NotAvailable from "@/components/Error/NotAvailable";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { Community } from "@/models/Community";
import { Avatar, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";

type CommunityDetailPageProps = {
    community: Community;
};

const CommunityDetailPage: React.FC<CommunityDetailPageProps> = ({
    community,
}) => {
    if (!community) {
        return (
            <NotAvailable title="Cộng đồng này không tồn tại hoặc đã bị xóa!" />
        );
    }
    return (
        <Flex direction="column">
            <Flex
                w="100%"
                bg="brand.400"
                p={6}
                borderRadius={4}
                // border="1px solid"
                // borderColor="brand.400"
                align="center"
            >
                <Avatar
                    src={community.imageUrl || "/images/noImage.jpg"}
                    size="xl"
                />
                <VStack align="flex-start" ml={4}>
                    <Text fontSize={20} fontWeight={600} color="white">
                        {community.name}
                    </Text>
                    <Button
                        w={28}
                        bg="white"
                        color="brand.100"
                        variant="outline"
                    >
                        Tham gia
                    </Button>
                </VStack>
            </Flex>
            {community.privacyType === "restricted" && (
                <Text>Bạn cần tham gia cộng đồng này để xem bài viết</Text>
            )}
        </Flex>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { cid } = context.query;
    const communityDocRef = doc(
        fireStore,
        firebaseRoute.getAllCommunityRoute(),
        cid as string
    );
    const communityDoc = await getDoc(communityDocRef);
    if (communityDoc.exists()) {
        return {
            props: {
                community: JSON.parse(
                    JSON.stringify({
                        id: communityDoc.id,
                        ...communityDoc.data(),
                    })
                ),
            },
        };
    } else {
        return {
            props: {},
        };
    }
}

export default CommunityDetailPage;
