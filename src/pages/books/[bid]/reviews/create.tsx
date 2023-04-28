import ReviewForm from "@/components/Form/Review";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { UserModel } from "@/models/User";
import { Flex } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import Head from "next/head";
import React, { useEffect } from "react";

type BookReviewCreatePageProps = {
    bookId: string;
    user: UserModel;
};

const BookReviewCreatePage: React.FC<BookReviewCreatePageProps> = ({
    bookId,
    user,
}) => {
    const { authAction } = useAuth();
    useEffect(() => {
        authAction.setDefaultPath(routes.getHomePage());
        authAction.setNeedAuth(true);
    }, []);

    return (
        <>
            <Head>
                <title>MangaKr - Tạo bài đánh giá</title>
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
                    <ReviewForm bookId={bookId} user={user} />
                </Flex>
            </>
        </>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user } = cookies(context) || null;
    const { bid } = context.query;
    if (!token) {
        context.res.writeHead(302, { Location: routes.getHomePage() });
        context.res.end();
    }
    const us = JSON.parse(JSON.stringify(user));

    return {
        props: {
            user: us,
            bookId: bid,
        },
    };
}

export default BookReviewCreatePage;
