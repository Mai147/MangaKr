import AuthorForm from "@/components/Author/Form";
import { WRITER_ROLE } from "@/constants/roles";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { Author } from "@/models/Author";
import AuthorService from "@/services/AuthorService";
import { Box } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect } from "react";

type AuthorEditPageProps = {
    author: Author;
};

const AuthorEditPage: React.FC<AuthorEditPageProps> = ({ author }) => {
    const { authAction } = useAuth();
    useEffect(() => {
        authAction.setDefaultPath(routes.getHomePage());
        authAction.setNeedAuth(true);
    }, []);
    return (
        <Box p="6" bg="white" borderRadius={4} boxShadow="lg" flexGrow={1}>
            <AuthorForm author={author} />
        </Box>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user, user_id } = cookies(context) || null;
    if (token) {
        const us = JSON.parse(JSON.stringify(user));
        if (us.role !== WRITER_ROLE) {
            context.res.writeHead(302, { Location: routes.getHomePage() });
            context.res.end();
        }
    } else {
        context.res.writeHead(302, { Location: routes.getHomePage() });
        context.res.end();
    }

    const us = JSON.parse(JSON.stringify(user));
    const { aid } = context.query;
    const author = (await AuthorService.get({
        authorId: aid as string,
    })) as Author;
    if (author) {
        return {
            props: {
                user: us,
                author,
            },
        };
    } else {
        return {
            props: {
                user: us,
            },
        };
    }
}

export default AuthorEditPage;
