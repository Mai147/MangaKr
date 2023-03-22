import AuthorForm from "@/components/Author/Form";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { WRITER_ROLE } from "@/constants/roles";
import { HOME_PAGE } from "@/constants/routes";
import { fireStore } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import { Author } from "@/models/Author";
import { Box } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect } from "react";

type AuthorEditPageProps = {
    author: Author;
};

const AuthorEditPage: React.FC<AuthorEditPageProps> = ({ author }) => {
    const { setDefaultPath, setNeedAuth } = useAuth();
    useEffect(() => {
        setDefaultPath(HOME_PAGE), setNeedAuth(true);
    }, []);
    return (
        <Box p="6" bg="white" borderRadius={4} boxShadow="lg">
            <AuthorForm author={author} />
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

    const us = JSON.parse(JSON.stringify(user));
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
        ) as Author;
        if (author.creatorId !== user_id) {
            context.res.writeHead(302, { Location: HOME_PAGE });
            context.res.end();
        }
        return {
            props: {
                user: us,
                author,
            },
        };
    } else {
        return {
            props: {
                user: us,
            },
        };
    }
}

export default AuthorEditPage;
