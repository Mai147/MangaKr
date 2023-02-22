import BookForm from "@/components/Book/Form";
import { WRITER_ROLE } from "@/constants/roles";
import { HOME_PAGE } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { Book } from "@/models/Book";
import BookUtils from "@/utils/BookUtils";
import { Box, Divider, Text } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect } from "react";

type BookEditProps = {
    userId: string;
    book: Book;
};

const BookEditPage: React.FC<BookEditProps> = ({ userId, book }) => {
    const { setDefaultPath, setNeedAuth } = useAuth();
    useEffect(() => {
        setDefaultPath(HOME_PAGE), setNeedAuth(true);
    }, []);
    return (
        <Box p="6" bg="white" borderRadius={4} boxShadow="lg">
            <Text fontSize={24} fontWeight={600}>
                Edit book
            </Text>
            <Divider my={4} />
            <BookForm userId={userId} book={book} />
        </Box>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user, user_id } = cookies(context) || null;
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

    const { bid } = context.query;
    const res = await BookUtils.getBook(bid as string, user_id as string);
    if (res) {
        return {
            props: {
                userId: user_id,
                book: res.book,
            },
        };
    } else {
        context.res.writeHead(302, { Location: HOME_PAGE });
        context.res.end();
    }
}

export default BookEditPage;
