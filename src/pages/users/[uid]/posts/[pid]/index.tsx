import NotAvailable from "@/components/Error/NotAvailable";
import PostItemDetail from "@/components/Post/Item/PostItemDetail";
import { routes } from "@/constants/routes";
import { PostProvider } from "@/context/PostContext";
import useAuth from "@/hooks/useAuth";
import { Post } from "@/models/Post";
import { UserModel } from "@/models/User";
import PostService from "@/services/PostService";
import UserService from "@/services/UserService";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import React, { useEffect } from "react";

type PostPageProps = {
    postUser: UserModel;
    post: Post;
};

const PostPage: React.FC<PostPageProps> = ({ post, postUser }) => {
    const { authAction } = useAuth();

    useEffect(() => {
        authAction.setNeedAuth(true);
        authAction.setDefaultPath(routes.getHomePage());
    }, []);

    if (!postUser || !post) {
        return (
            <>
                <Head>
                    <title>MangaKr</title>
                </Head>
                <>
                    <NotAvailable title="Bài viết này không tồn tại hoặc đã bị xóa!" />
                </>
            </>
        );
    }
    return (
        <>
            <Head>
                <title>MangaKr</title>
            </Head>
            <>
                <PostProvider selectedUser={postUser}>
                    <PostItemDetail post={post} />
                </PostProvider>
            </>
        </>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { uid, pid } = context.query;
    const postUser = await UserService.get({ userId: uid as string });
    if (postUser) {
        const post = await PostService.get({
            userId: uid as string,
            postId: pid as string,
        });
        if (post) {
            return {
                props: {
                    postUser: JSON.parse(JSON.stringify(postUser)),
                    post: JSON.parse(JSON.stringify(post)),
                },
            };
        }
    }
    return {
        props: {},
    };
}

export default PostPage;
