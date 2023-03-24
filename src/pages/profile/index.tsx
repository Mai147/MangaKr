import ProfileDetail from "@/components/Profile/Detail";
import ProfilePassword from "@/components/Profile/Password";
import ProfileShow from "@/components/Profile/Show";
import ProfileSidebar from "@/components/Profile/Sidebar";
import { HOME_PAGE } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect, useState } from "react";

type ProfilePageProps = {};

const ProfilePage: React.FC<ProfilePageProps> = ({}) => {
    const { user, setNeedAuth, setDefaultPath } = useAuth();
    const [tab, setTab] = useState(0);

    useEffect(() => {
        setNeedAuth(true);
        setDefaultPath(HOME_PAGE);
    }, []);

    if (!user) {
        return (
            <Flex align="center" justify="center">
                <Spinner />
            </Flex>
        );
    }

    return (
        <Flex
            align="flex-start"
            direction={{ base: "column", md: "row" }}
            bg="white"
            p={6}
            boxShadow="lg"
            borderRadius={4}
        >
            <ProfileSidebar tab={tab} setTab={setTab} />
            <Box
                borderLeft="1px solid"
                borderColor="gray.200"
                pl={5}
                flexGrow={1}
            >
                {tab == 0 && <ProfileShow user={user} />}
                {tab == 1 && <ProfileDetail user={user} />}
                {tab == 2 && <ProfilePassword user={user} />}
            </Box>
        </Flex>
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

export default ProfilePage;
