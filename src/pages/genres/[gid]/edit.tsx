import GenreForm from "@/components/Genre/GenreForm";
import { WRITER_ROLE } from "@/constants/roles";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { Genre } from "@/models/Genre";
import GenreService from "@/services/GenreService";
import { Box } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect } from "react";

type GenreEditPageProps = {
    genre: Genre;
};

const GenreEditPage: React.FC<GenreEditPageProps> = ({ genre }) => {
    const { setDefaultPath, setNeedAuth } = useAuth();
    useEffect(() => {
        setDefaultPath(routes.getHomePage()), setNeedAuth(true);
    }, []);
    return (
        <Box p="6" bg="white" borderRadius={4} boxShadow="lg" flexGrow={1}>
            <GenreForm genre={genre} />
        </Box>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user, user_id } = cookies(context) || null;
    if (token) {
        const us = JSON.parse(JSON.stringify(user));
        if (us.role !== WRITER_ROLE) {
            context.res.writeHead(302, { Location: routes.getHomePage() });
            context.res.end();
        }
    } else {
        context.res.writeHead(302, { Location: routes.getHomePage() });
        context.res.end();
    }

    const us = JSON.parse(JSON.stringify(user));
    const { gid } = context.query;
    const genre = (await GenreService.get({
        genreId: gid as string,
    })) as Genre;
    if (genre) {
        return {
            props: {
                user: us,
                genre,
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

export default GenreEditPage;
