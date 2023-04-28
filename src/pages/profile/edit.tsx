import ProfileDetail from "@/components/Profile/Edit/Detail";
import ProfilePassword from "@/components/Profile/Edit/Password";
import ProfileSetting from "@/components/Profile/Edit/Setting";
import ProfileSidebar from "@/components/Profile/Edit/Sidebar";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import Head from "next/head";
import React, { useEffect, useState } from "react";

type ProfileEditPageProps = {};

const ProfileEditPage: React.FC<ProfileEditPageProps> = ({}) => {
    const { user, authAction } = useAuth();
    const [tab, setTab] = useState(0);

    useEffect(() => {
        authAction.setNeedAuth(true);
        authAction.setDefaultPath(routes.getHomePage());
    }, []);

    return (
        <>
            <Head>
                <title>MangaKr - Hồ sơ</title>
            </Head>
            <>
                {!user ? (
                    <Flex align="center" justify="center">
                        <Spinner />
                    </Flex>
                ) : (
                    <Flex
                        align="flex-start"
                        direction={{ base: "column", md: "row" }}
                        bg="white"
                        p={6}
                        boxShadow="lg"
                        borderRadius={4}
                        flexGrow={1}
                    >
                        <ProfileSidebar tab={tab} setTab={setTab} />
                        <Box
                            borderLeft="1px solid"
                            borderColor="gray.200"
                            pl={5}
                            flexGrow={1}
                            alignSelf="stretch"
                        >
                            {tab == 0 && <ProfileDetail user={user} />}
                            {tab == 1 && <ProfilePassword user={user} />}
                            {tab == 2 && <ProfileSetting user={user} />}
                        </Box>
                    </Flex>
                )}
            </>
        </>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token } = cookies(context) || null;
    if (token) {
        return {
            props: {},
        };
    } else {
        context.res.writeHead(302, { Location: routes.getHomePage() });
        context.res.end();
    }
}

export default ProfileEditPage;
