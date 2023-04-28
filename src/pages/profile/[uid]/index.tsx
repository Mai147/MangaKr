import PageContent from "@/components/Layout/PageContent";
import RightSidebar from "@/components/Layout/Sidebar/RightSidebar";
import ProfileShow from "@/components/Profile";
import { PostProvider } from "@/context/PostContext";
import { UserModel } from "@/models/User";
import UserService from "@/services/UserService";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import React from "react";

type ProfilePageProps = {
    user: UserModel;
};

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
    return (
        <>
            <Head>
                <title>{`MangaKr - Trang cá nhân - ${user.displayName}`}</title>
            </Head>
            <>
                <PageContent>
                    <PostProvider selectedUser={user}>
                        <ProfileShow user={user} />
                    </PostProvider>
                    <RightSidebar />
                </PageContent>
            </>
        </>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { uid } = context.query;
    const user = await UserService.get({ userId: uid as string });
    return {
        props: {
            user: user ? JSON.parse(JSON.stringify(user)) : null,
        },
    };
}

export default ProfilePage;
