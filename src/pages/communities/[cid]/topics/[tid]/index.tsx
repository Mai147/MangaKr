import TopicItem from "@/components/Community/Topic/Item";
import NotAvailable from "@/components/Error/NotAvailable";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import useCommunity from "@/hooks/useCommunity";
import { Community } from "@/models/Community";
import { Topic } from "@/models/Topic";
import CommunityService from "@/services/CommunityService";
import TopicService from "@/services/TopicService";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import Head from "next/head";
import React, { useEffect } from "react";

type TopicPageProps = {
    community: Community;
    topic: Topic;
};

const TopicPage: React.FC<TopicPageProps> = ({ community, topic }) => {
    const { authAction } = useAuth();
    const { communityAction } = useCommunity();

    useEffect(() => {
        authAction.setNeedAuth(true);
        authAction.setDefaultPath(routes.getHomePage());
    }, []);

    useEffect(() => {
        communityAction.setSelectedCommunity(community);
    }, [community]);

    return (
        <>
            <Head>
                <title>{`MangaKr - Cuộc bình chọn - ${
                    topic?.title || ""
                }`}</title>
            </Head>
            <>
                {!community || !topic ? (
                    <NotAvailable title="Cuộc bình chọn này không tồn tại hoặc đã bị xóa!" />
                ) : (
                    <TopicItem topic={topic} />
                )}
            </>
        </>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user, user_id } = cookies(context) || null;
    const { cid, tid } = context.query;
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
            return {
                props: {},
            };
        }
        const topic = await TopicService.get({
            communityId: cid as string,
            topicId: tid as string,
            isAccept: true,
            isLock: false,
        });
        if (topic) {
            return {
                props: {
                    community,
                    topic,
                },
            };
        }
    }
    return {
        props: {},
    };
}

export default TopicPage;
