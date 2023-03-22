import AuthorForm from "@/components/Author/Form";
import { WRITER_ROLE } from "@/constants/roles";
import { HOME_PAGE } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { Box } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect } from "react";

type AuthorCreatePageProps = {};

const AuthorCreatePage: React.FC<AuthorCreatePageProps> = () => {
    const { setNeedAuth, setDefaultPath } = useAuth();

    useEffect(() => {
        setNeedAuth(true);
        setDefaultPath(HOME_PAGE);
    }, []);

    return (
        <Box p="6" bg="white" borderRadius={4} boxShadow="lg">
            <AuthorForm />
        </Box>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user } = cookies(context) || null;
    if (token) {
        const us = JSON.parse(JSON.stringify(user));
        if (us.role !== WRITER_ROLE) {
            context.res.writeHead(302, { Location: HOME_PAGE });
            context.res.end();
        }
    } else {
        context.res.writeHead(302, { Location: HOME_PAGE });
        context.res.end();
    }

    return {
        props: {},
    };
}

export default AuthorCreatePage;
