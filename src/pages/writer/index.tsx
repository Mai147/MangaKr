import WriterEditBox from "@/components/Writer/WriterEditBox";
import { WRITER_ROLE } from "@/constants/roles";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { Flex } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import Head from "next/head";
import React, { useEffect } from "react";

type WriterPageProps = {};

const WriterPage: React.FC<WriterPageProps> = () => {
    const { authAction } = useAuth();

    useEffect(() => {
        authAction.setNeedAuth(true);
        authAction.setDefaultPath(routes.getHomePage());
    }, []);

    return (
        <>
            <Head>
                <title>MangaKr</title>
            </Head>
            <>
                <Flex
                    direction="column"
                    p={0}
                    boxShadow="lg"
                    bg="white"
                    borderRadius={4}
                    flexGrow={1}
                >
                    <WriterEditBox />
                </Flex>
            </>
        </>
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

    return {
        props: {},
    };
}

export default WriterPage;
