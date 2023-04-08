import BookDetail from "@/components/Book/Detail";
import BookError from "@/components/Book/Error";
import useAuth from "@/hooks/useAuth";
import { Book } from "@/models/Book";
import { UserModel } from "@/models/User";
import BookService from "@/services/BookService";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect } from "react";

type BookDetailPageProps = {
    book: Book;
    user?: UserModel | null;
};

const BookDetailPage: React.FC<BookDetailPageProps> = ({ book, user }) => {
    const { setNeedAuth } = useAuth();
    useEffect(() => {
        setNeedAuth(false);
    }, []);

    if (!book) {
        return <BookError />;
    }
    return <BookDetail book={book} user={user} />;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user } = cookies(context) || null;
    const { bid } = context.query;
    let us;
    let book = null;
    if (token) {
        us = JSON.parse(JSON.stringify(user));
    }
    const res = await BookService.get({ bookId: bid as string });
    if (res) book = res.book;

    return {
        props: {
            user: us,
            book,
        },
    };
}

export default BookDetailPage;
