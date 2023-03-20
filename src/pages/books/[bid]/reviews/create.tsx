import ReviewForm from "@/components/Review/Form";
import { HOME_PAGE } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { UserModel } from "@/models/User";
import { Box } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect } from "react";

type BookReviewCreatePageProps = {
    bookId: string;
    user: UserModel;
};

const BookReviewCreatePage: React.FC<BookReviewCreatePageProps> = ({
    bookId,
    user,
}) => {
    const { setDefaultPath, setNeedAuth } = useAuth();
    useEffect(() => {
        setDefaultPath(HOME_PAGE), setNeedAuth(true);
    }, []);

    return (
        <Box p="6" bg="white" borderRadius={4} boxShadow="lg">
            <ReviewForm bookId={bookId} user={user} />
        </Box>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user } = cookies(context) || null;
    const { bid } = context.query;
    if (!token) {
        context.res.writeHead(302, { Location: HOME_PAGE });
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
