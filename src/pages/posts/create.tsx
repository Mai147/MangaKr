import PostForm from "@/components/Form/Post";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { UserModel } from "@/models/User";
import { Flex } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import Head from "next/head";
import React, { useEffect } from "react";

type PostCreatePageProps = {
    user: UserModel;
};

const PostCreatePage: React.FC<PostCreatePageProps> = ({ user }) => {
    const { authAction } = useAuth();

    useEffect(() => {
        authAction.setNeedAuth(true);
        authAction.setDefaultPath(routes.getHomePage());
    }, []);

    return (
        <>
            <Head>
                <title>MangaKr - Tạo bài viết</title>
            </Head>
            <>
                <Flex
                    p={{ base: 4, md: 6 }}
                    boxShadow="lg"
                    bg="white"
                    borderRadius={{ base: 0, md: 4 }}
                    flexGrow={1}
                    direction="column"
                >
                    <PostForm user={user} />
                </Flex>
            </>
        </>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user } = cookies(context) || null;
    if (!token) {
        context.res.writeHead(302, { Location: routes.getHomePage() });
        context.res.end();
    } else {
        const us = JSON.parse(JSON.stringify(user));
        return {
            props: {
                user: us,
            },
        };
    }
}

export default PostCreatePage;
