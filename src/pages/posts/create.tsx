import PostForm from "@/components/Form/Post";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { UserModel } from "@/models/User";
import { Flex } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
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
        <Flex
            p={6}
            boxShadow="lg"
            bg="white"
            borderRadius={4}
            flexGrow={1}
            direction="column"
        >
            <PostForm user={user} />
        </Flex>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user, user_id } = cookies(context) || null;
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
