import AuthorDetail from "@/components/Author/Detail";
import NotAvailable from "@/components/Error/NotAvailable";
import PageContent from "@/components/Layout/PageContent";
import RightSidebar from "@/components/Layout/Sidebar/RightSidebar";
import { Author } from "@/models/Author";
import AuthorService from "@/services/AuthorService";
import { GetServerSidePropsContext } from "next";
import React from "react";

type AuthorDetailPageProps = {
    author?: Author;
};

const AuthorDetailPage: React.FC<AuthorDetailPageProps> = ({ author }) => {
    if (!author) {
        return <NotAvailable title="Tác giả không tồn tại hoặc đã bị khóa!" />;
    }

    return (
        <PageContent>
            <AuthorDetail author={author} />
            <RightSidebar />
        </PageContent>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { aid } = context.query;
    const author = await AuthorService.get({ authorId: aid as string });
    if (author) {
        return {
            props: {
                author,
            },
        };
    } else {
        return {
            props: {},
        };
    }
}

export default AuthorDetailPage;
