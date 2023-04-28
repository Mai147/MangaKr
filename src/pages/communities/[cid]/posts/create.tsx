import NotAvailable from "@/components/Error/NotAvailable";
import PostForm from "@/components/Form/Post";
import { CommunityRole } from "@/constants/roles";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import useCommunity from "@/hooks/useCommunity";
import { Community } from "@/models/Community";
import { UserModel } from "@/models/User";
import CommunityService from "@/services/CommunityService";
import { Flex } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import Head from "next/head";
import React, { useEffect } from "react";

type CommunityCreatePostPageProps = {
    community: Community;
    user?: UserModel;
    userRole?: CommunityRole;
};

const CommunityCreatePostPage: React.FC<CommunityCreatePostPageProps> = ({
    community,
    user,
    userRole,
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

    return (
        <>
            <Head>
                <title>{`MangaKr - Cộng đồng ${
                    community?.name || ""
                } - Tạo bài viết`}</title>
            </Head>
            <>
                {!community ? (
                    <NotAvailable title="Cộng đồng này không tồn tại hoặc đã bị xóa!" />
                ) : !user ? (
                    <></>
                ) : (
                    <Flex
                        direction="column"
                        p={6}
                        boxShadow="lg"
                        bg="white"
                        borderRadius={4}
                        flexGrow={1}
                    >
                        <PostForm user={user} community={community} />
                    </Flex>
                )}
            </>
        </>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user, user_id } = cookies(context) || null;
    if (!token) {
        context.res.writeHead(302, { Location: routes.getHomePage() });
        context.res.end();
    } else {
        const { cid } = context.query;
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
                context.res.writeHead(302, { Location: routes.getHomePage() });
                context.res.end();
            }
            return {
                props: {
                    community,
                    user: us,
                    userRole: userRole
                        ? JSON.parse(JSON.stringify(userRole?.role))
                        : null,
                },
            };
        }
        return {
            props: {},
        };
    }
}

export default CommunityCreatePostPage;
