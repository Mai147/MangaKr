import AdminDashboard from "@/components/Admin/Dashboard";
import { ADMIN_ROLE } from "@/constants/roles";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect } from "react";

type AdminPageProps = {};

const AdminPage: React.FC<AdminPageProps> = () => {
    const { authAction } = useAuth();

    useEffect(() => {
        authAction.setNeedAuth(true);
        authAction.setDefaultPath(routes.getAdminLoginPage());
    }, []);

    return <AdminDashboard />;
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
        }
    } else {
        context.res.writeHead(302, { Location: routes.getAdminLoginPage() });
        context.res.end();
    }

    return {
        props: {},
    };
}

export default AdminPage;
