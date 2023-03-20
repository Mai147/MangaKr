import AuthorDetail from "@/components/Author/Detail";
import BookSnippetHorizontalItem from "@/components/Book/Snippet/BookSnippetHorizontalItem";
import BookCarousel from "@/components/Book/Snippet/Carousel";
import NotAvailable from "@/components/Error/NotAvailable";
import PageContent from "@/components/Layout/PageContent";
import RightSidebar from "@/components/Layout/Sidebar/RightSidebar";
import Pagination from "@/components/Pagination";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import usePagination from "@/hooks/usePagination";
import { Author } from "@/models/Author";
import { Book } from "@/models/Book";
import {
    Avatar,
    Divider,
    Flex,
    Grid,
    GridItem,
    Icon,
    Text,
    VStack,
} from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { useEffect, useState } from "react";
import { FaBook } from "react-icons/fa";
import { ImHeart, ImHeartBroken } from "react-icons/im";

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
    const authorDocRef = doc(
        fireStore,
        firebaseRoute.getAllAuthorRoute(),
        aid as string
    );
    const authorDoc = await getDoc(authorDocRef);
    if (authorDoc.exists()) {
        const author = JSON.parse(
            JSON.stringify({
                id: authorDoc.id,
                ...authorDoc.data(),
            } as Author)
        );
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
