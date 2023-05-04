import GenreForm from "@/components/Form/Genre";
import { WRITER_ROLE } from "@/constants/roles";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { Flex } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import Head from "next/head";
import React, { useEffect } from "react";

type GenreCreatePageProps = {};

const GenreCreatePage: React.FC<GenreCreatePageProps> = () => {
    const { authAction } = useAuth();

    useEffect(() => {
        authAction.setNeedAuth(true);
        authAction.setDefaultPath(routes.getHomePage());
    }, []);

    return (
        <>
            <Head>
                <title>MangaKr - Tạo thể loại</title>
            </Head>
            <>
                <Flex
                    direction="column"
                    p={{ base: 4, md: 6 }}
                    bg="white"
                    borderRadius={{ base: 0, md: 4 }}
                    boxShadow="lg"
                    flexGrow={1}
                >
                    <GenreForm />
                </Flex>
            </>
        </>
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
