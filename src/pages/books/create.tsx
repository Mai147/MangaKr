import { WRITER_ROLE } from "@/constants/roles";
import { HOME_PAGE } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import cookies from "next-cookies";
import React, { useEffect } from "react";
import { GetServerSidePropsContext } from "next";
import BookForm from "@/components/Book/Form";
import { Box, Divider, Text } from "@chakra-ui/react";
import BookForm2 from "@/components/Test/BookForm";
import { BookProvider } from "@/context/BookContext";

type BookCreatePageProps = {
    userId: string;
};

const BookCreatePage: React.FC<BookCreatePageProps> = ({ userId }) => {
    const { setNeedAuth, setDefaultPath } = useAuth();

    useEffect(() => {
        setNeedAuth(true);
        setDefaultPath(HOME_PAGE);
    }, []);

    return (
        <Box p="6" bg="white" borderRadius={4} boxShadow="lg">
            <BookProvider>
                <BookForm2 />
            </BookProvider>
            {/* <BookForm userId={userId} /> */}
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

    return {
        props: {
            userId: user_id,
        },
    };
}

export default BookCreatePage;
