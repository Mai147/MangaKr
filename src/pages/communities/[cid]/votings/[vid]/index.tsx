import VotingItem from "@/components/Community/VotingTab/VotingItem";
import NotAvailable from "@/components/Error/NotAvailable";
import { routes } from "@/constants/routes";
import { VotingProvider } from "@/context/VotingContext";
import useAuth from "@/hooks/useAuth";
import useCommunity from "@/hooks/useCommunity";
import { Community } from "@/models/Community";
import { Voting } from "@/models/Vote";
import CommunityService from "@/services/CommunityService";
import VotingService from "@/services/VotingService";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect } from "react";

type VotingPageProps = {
    community: Community;
    voting: Voting;
};

const VotingPage: React.FC<VotingPageProps> = ({ community, voting }) => {
    const { authAction } = useAuth();
    const { communityAction } = useCommunity();

    useEffect(() => {
        authAction.setNeedAuth(true);
        authAction.setDefaultPath(routes.getHomePage());
    }, []);

    useEffect(() => {
        communityAction.setSelectedCommunity(community);
    }, [community]);

    if (!community || !voting) {
        return (
            <NotAvailable title="Cuộc bình chọn này không tồn tại hoặc đã bị xóa!" />
        );
    }
    return (
        <VotingProvider community={community} voting={voting}>
            <VotingItem voting={voting} />
        </VotingProvider>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user, user_id } = cookies(context) || null;
    const { cid, vid } = context.query;
    const community = await CommunityService.get({
        communityId: cid as string,
    });
    if (community) {
        let us;
        let userRole;
        if (token) {
            us = JSON.parse(JSON.stringify(user));
            userRole = await CommunityService.getUserRole({
                communityId: community.id!,
                userId: user_id as string,
            });
        }
        const res = CommunityService.canViewPosts({
            communityType: community.privacyType,
            user: us,
            userRole: userRole?.role,
        });
        if (!res) {
            context.res.writeHead(302, {
                Location: routes.getCommunityDetailPage(community.id!),
            });
            context.res.end();
            return;
        }
        const voting = await VotingService.get({
            communityId: cid as string,
            votingId: vid as string,
        });
        return {
            props: {
                community: community || null,
                voting: voting || null,
            },
        };
    }
}

export default VotingPage;
