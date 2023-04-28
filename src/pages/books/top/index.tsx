import BookSearch from "@/components/Book/Search";
import PageContent from "@/components/Layout/PageContent";
import RightSidebar from "@/components/Layout/Sidebar/RightSidebar";
import { BookProvider } from "@/context/BookContext";
import useAuth from "@/hooks/useAuth";
import Head from "next/head";
import React, { useEffect } from "react";

type BookTopPageProps = {};

const BookTopPage: React.FC<BookTopPageProps> = () => {
    const { authAction } = useAuth();

    useEffect(() => {
        authAction.setNeedAuth(false);
    }, []);

    return (
        <>
            <Head>
                <title>MangaKr - TopManga</title>
            </Head>
            <>
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
            </>
        </>
    );
};
export default BookTopPage;
