import { WRITER_ROLE } from "@/constants/roles";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import cookies from "next-cookies";
import React, { useEffect } from "react";
import { GetServerSidePropsContext } from "next";
import { Flex } from "@chakra-ui/react";
import { BookCreateProvider } from "@/context/BookCreateContext";
import BookForm from "@/components/Form/Book";
import Head from "next/head";

type BookCreatePageProps = {};

const BookCreatePage: React.FC<BookCreatePageProps> = () => {
    const { authAction } = useAuth();

    useEffect(() => {
        authAction.setNeedAuth(true);
        authAction.setDefaultPath(routes.getHomePage());
    }, []);

    return (
        <>
            <Head>
                <title>MangaKr - Tạo Manga</title>
            </Head>
            <>
                <Flex
                    direction="column"
                    p="6"
                    bg="white"
                    borderRadius={4}
                    boxShadow="lg"
                    flexGrow={1}
                >
                    <BookCreateProvider>
                        <BookForm />
                    </BookCreateProvider>
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

export default BookCreatePage;
