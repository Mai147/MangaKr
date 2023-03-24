import NotAvailable from "@/components/Error/NotAvailable";
import PostForm from "@/components/Post/Form";
import { HOME_PAGE } from "@/constants/routes";
import useCommunity from "@/hooks/useCommunity";
import { Community } from "@/models/Community";
import { UserModel } from "@/models/User";
import CommunityUtils from "@/utils/CommunityUtils";
import ModelUtils from "@/utils/ModelUtils";
import { Box } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect } from "react";

type CommunityCreatePostPageProps = {
    community: Community;
    user?: UserModel;
};

const CommunityCreatePostPage: React.FC<CommunityCreatePostPageProps> = ({
    community,
    user,
}) => {
    const { communityAction } = useCommunity();

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
        <Box p={6} boxShadow="lg" bg="white" borderRadius={4}>
            <PostForm user={user} community={community} />
        </Box>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user, user_id } = cookies(context) || null;
    if (!token) {
        context.res.writeHead(302, { Location: HOME_PAGE });
        context.res.end();
    } else {
        const { cid } = context.query;
        const community = await ModelUtils.getCommunity(cid as string);
        if (community) {
            const us = JSON.parse(JSON.stringify(user));
            const userRole = await CommunityUtils.getUserCommunityRole(
                community.id!,
                user_id as string
            );
            const res = CommunityUtils.canCreatePosts(
                community.privacyType,
                userRole
            );
            if (!res) {
                context.res.writeHead(302, { Location: HOME_PAGE });
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

export default CommunityCreatePostPage;
