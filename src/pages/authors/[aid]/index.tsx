import AuthorDetail from "@/components/Author/Detail";
import NotAvailable from "@/components/Error/NotAvailable";
import PageContent from "@/components/Layout/PageContent";
import RightSidebar from "@/components/Layout/Sidebar/RightSidebar";
import useAuth from "@/hooks/useAuth";
import { Author } from "@/models/Author";
import AuthorService from "@/services/AuthorService";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import React, { useEffect } from "react";

type AuthorDetailPageProps = {
    author?: Author;
};

const AuthorDetailPage: React.FC<AuthorDetailPageProps> = ({ author }) => {
    const { authAction } = useAuth();
    useEffect(() => {
        authAction.setNeedAuth(false);
    }, []);

    return (
        <>
            <Head>
                <title>{`MangaKr - Tác giả ${author?.name || ""}`}</title>
            </Head>
            <>
                {!author ? (
                    <NotAvailable title="Tác giả không tồn tại hoặc đã bị khóa!" />
                ) : (
                    <PageContent>
                        <AuthorDetail author={author} />
                        <RightSidebar />
                    </PageContent>
                )}
            </>
        </>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { aid } = context.query;
    const author = await AuthorService.get({ authorId: aid as string });
    return {
        props: {
            author: author || null,
        },
    };
}

export default AuthorDetailPage;
