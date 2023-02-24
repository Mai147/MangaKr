import LibraryBook from "@/components/Library/Book";
import LibraryReview from "@/components/Library/Review";
import { HOME_PAGE } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { Box, Divider } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect } from "react";

type ProfileLibaryPageProps = {};

const ProfileLibraryPage: React.FC<ProfileLibaryPageProps> = () => {
    const { setDefaultPath, setNeedAuth } = useAuth();

    useEffect(() => {
        setNeedAuth(true);
        setDefaultPath(HOME_PAGE);
    }, []);

    return (
        <Box>
            <LibraryBook />
            <Divider my={4} />
            <LibraryReview />
        </Box>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token } = cookies(context) || null;
    if (token) {
        return {
            props: {},
        };
    } else {
        context.res.writeHead(302, { Location: HOME_PAGE });
        context.res.end();
    }
}

export default ProfileLibraryPage;
