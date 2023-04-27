import NotAvailable from "@/components/Error/NotAvailable";
import PostItemDetail from "@/components/Post/Item/PostItemDetail";
import { routes } from "@/constants/routes";
import { PostProvider } from "@/context/PostContext";
import useAuth from "@/hooks/useAuth";
import useCommunity from "@/hooks/useCommunity";
import { Community } from "@/models/Community";
import { Post } from "@/models/Post";
import CommunityService from "@/services/CommunityService";
import PostService from "@/services/PostService";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect } from "react";

type PostPageProps = {
    community: Community;
    post: Post;
};

const PostPage: React.FC<PostPageProps> = ({ community, post }) => {
    const { authAction } = useAuth();
    const { communityAction } = useCommunity();

    useEffect(() => {
        authAction.setNeedAuth(true);
        authAction.setDefaultPath(routes.getHomePage());
    }, []);

    useEffect(() => {
        communityAction.setSelectedCommunity(community);
    }, [community]);

    if (!community || !post) {
        return (
            <NotAvailable title="Bài viết này không tồn tại hoặc đã bị xóa!" />
        );
    }
    return (
        <PostProvider selectedCommunity={community}>
            <PostItemDetail post={post} />
        </PostProvider>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user, user_id } = cookies(context) || null;
    const { cid, pid } = context.query;
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
        const post = await PostService.get({
            communityId: cid as string,
            postId: pid as string,
            isAccept: true,
            isLock: false,
        });
        if (post) {
            return {
                props: {
                    community,
                    post,
                },
            };
        }
    }
    return {
        props: {},
    };
}

export default PostPage;
