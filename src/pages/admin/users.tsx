import AdminUserAuthorize from "@/components/Admin/User/UserAuthorize";
import { ADMIN_ROLE } from "@/constants/roles";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { Flex } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import Head from "next/head";
import React, { useEffect } from "react";

type AdminUserPageProps = {};

const AdminUserPage: React.FC<AdminUserPageProps> = () => {
    const { authAction } = useAuth();

    useEffect(() => {
        authAction.setNeedAuth(true);
        authAction.setDefaultPath(routes.getHomePage());
    }, []);

    return (
        <>
            <Head>
                <title>MangaKr - Admin - Tài khoản</title>
            </Head>
            <>
                <Flex
                    direction="column"
                    p={0}
                    boxShadow="lg"
                    bg="white"
                    borderRadius={8}
                    flexGrow={1}
                >
                    <AdminUserAuthorize />
                </Flex>
            </>
        </>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user } = cookies(context) || null;
    if (token) {
        const us = JSON.parse(JSON.stringify(user));
        if (us.role !== ADMIN_ROLE) {
            context.res.writeHead(302, {
                Location: routes.getAdminLoginPage(),
            });
            context.res.end();
        } else {
            return {
                props: {
                    users: us,
                },
            };
        }
    } else {
        context.res.writeHead(302, { Location: routes.getAdminLoginPage() });
        context.res.end();
    }

    return {
        props: {},
    };
}

export default AdminUserPage;
