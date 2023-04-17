import PageContent from "@/components/Layout/PageContent";
import RightSidebar from "@/components/Layout/Sidebar/RightSidebar";
import ProfileShow from "@/components/Profile";
import { PostProvider } from "@/context/PostContext";
import { UserModel } from "@/models/User";
import UserService from "@/services/UserService";
import { GetServerSidePropsContext } from "next";
import React from "react";

type ProfilePageProps = {
    user: UserModel;
};

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
    return (
        <PageContent>
            <PostProvider selectedUser={user}>
                <ProfileShow user={user} />
            </PostProvider>
            <RightSidebar />
        </PageContent>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    // const { token } = cookies(context) || null;
    // if (token) {
    //     return {
    //         props: {},
    //     };
    // } else {
    //     context.res.writeHead(302, { Location: routes.getHomePage() });
    //     context.res.end();
    // }
    const { uid } = context.query;
    const user = await UserService.get({ userId: uid as string });
    return {
        props: {
            user: user || null,
        },
    };
}

export default ProfilePage;
