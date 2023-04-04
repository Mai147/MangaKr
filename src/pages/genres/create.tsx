import AuthorForm from "@/components/Author/Form";
import GenreForm from "@/components/Genre/GenreForm";
import { WRITER_ROLE } from "@/constants/roles";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { Box } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect } from "react";

type GenreCreatePageProps = {};

const GenreCreatePage: React.FC<GenreCreatePageProps> = () => {
    const { setNeedAuth, setDefaultPath } = useAuth();

    useEffect(() => {
        setNeedAuth(true);
        setDefaultPath(routes.getHomePage());
    }, []);

    return (
        <Box p="6" bg="white" borderRadius={4} boxShadow="lg">
            <GenreForm />
        </Box>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user } = cookies(context) || null;
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

    return {
        props: {},
    };
}

export default GenreCreatePage;
