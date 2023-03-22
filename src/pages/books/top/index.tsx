import BookSearch from "@/components/Book/Search";
import PageContent from "@/components/Layout/PageContent";
import RightSidebar from "@/components/Layout/Sidebar/RightSidebar";
import { BOOK_PAGE_COUNT } from "@/constants/pagination";
import { BookProvider } from "@/context/BookContext";
import useAuth from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";

type BookTopPageProps = {};

const BookTopPage: React.FC<BookTopPageProps> = () => {
    const { setNeedAuth } = useAuth();

    useEffect(() => {
        setNeedAuth(false);
    }, []);

    return (
        <PageContent>
            <BookProvider>
                <BookSearch
                    title="Manga hàng đầu"
                    pageView="top"
                    noResultText="Không có Manga nào!"
                />
            </BookProvider>
            <RightSidebar />
        </PageContent>
    );
};
export default BookTopPage;
