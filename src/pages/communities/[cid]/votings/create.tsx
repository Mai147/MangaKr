import NotAvailable from "@/components/Error/NotAvailable";
import VotingForm from "@/components/Form/Voting";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import useCommunity from "@/hooks/useCommunity";
import { Community } from "@/models/Community";
import { UserModel } from "@/models/User";
import CommunityService from "@/services/CommunityService";
import { Flex } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect } from "react";

type CommunityCreateVotingPageProps = {
    community: Community;
    user?: UserModel;
};

const CommunityCreateVotingPage: React.FC<CommunityCreateVotingPageProps> = ({
    community,
    user,
}) => {
    const { authAction } = useAuth();
    const { communityAction } = useCommunity();

    useEffect(() => {
        authAction.setNeedAuth(true);
        authAction.setDefaultPath(routes.getHomePage());
    }, []);

    useEffect(() => {
        communityAction.setSelectedCommunity(community);
    }, [community]);

    if (!community) {
        return (
            <NotAvailable title="Cộng đồng này không tồn tại hoặc đã bị xóa!" />
        );
    }
    if (!user) {
        return <></>;
    }
    return (
        <Flex
            direction="column"
            flexGrow={1}
            p={6}
            boxShadow="lg"
            bg="white"
            borderRadius={4}
        >
            <VotingForm user={user} community={community} />
        </Flex>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user, user_id } = cookies(context) || null;
    const { cid } = context.query;
    if (!token) {
        context.res.writeHead(302, {
            Location: routes.getCommunityDetailPage(cid as string),
        });
        context.res.end();
    } else {
        const community = await CommunityService.get({
            communityId: cid as string,
        });
        if (community) {
            const us = JSON.parse(JSON.stringify(user));
            const userRole = await CommunityService.getUserRole({
                communityId: community.id!,
                userId: user_id as string,
            });
            const res = CommunityService.canCreatePosts({
                communityType: community.privacyType,
                userRole: userRole?.role,
                user: us,
            });
            if (!res) {
                context.res.writeHead(302, {
                    Location: routes.getCommunityDetailPage(community.id!),
                });
                context.res.end();
            }
            return {
                props: {
                    community,
                    user: us,
                },
            };
        }
        return {
            props: {},
        };
    }
}

export default CommunityCreateVotingPage;
