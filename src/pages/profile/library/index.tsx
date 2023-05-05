import LibraryBook from "@/components/Library/Book";
import LibraryReview from "@/components/Library/Review";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { Box, Divider } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import Head from "next/head";
import React, { useEffect, useState } from "react";

type ProfileLibaryPageProps = {};

const ProfileLibraryPage: React.FC<ProfileLibaryPageProps> = () => {
    const { authAction } = useAuth();
    const [confirmTitle, setConfirmTitle] = useState("");
    const [confirmContent, setConfirmContent] = useState("");
    const [confirmSubContent, setConfirmSubContent] = useState("");
    const [confirmSubmitFunc, setConfirmSubmitFunc] = useState<
        () => () => Promise<void>
    >(() => async () => {});

    useEffect(() => {
        authAction.setNeedAuth(true);
        authAction.setDefaultPath(routes.getHomePage());
    }, []);

    return (
        <>
            <Head>
                <title>MangaKr - Thư viện</title>
            </Head>
            <>
                <Box p={4}>
                    <ConfirmModal
                        title={confirmTitle}
                        content={confirmContent}
                        subContent={confirmSubContent}
                        onSubmit={async () => {
                            confirmSubmitFunc();
                        }}
                    />
                    <LibraryBook
                        setConfirmContent={setConfirmContent}
                        setConfirmSubContent={setConfirmSubContent}
                        setConfirmSubmitFunc={setConfirmSubmitFunc}
                        setConfirmTitle={setConfirmTitle}
                    />
                    <Divider my={4} borderColor="gray.400" />
                    <LibraryReview
                        setConfirmContent={setConfirmContent}
                        setConfirmSubContent={setConfirmSubContent}
                        setConfirmSubmitFunc={setConfirmSubmitFunc}
                        setConfirmTitle={setConfirmTitle}
                    />
                </Box>
            </>
        </>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token } = cookies(context) || null;
    if (!token) {
        context.res.writeHead(302, { Location: routes.getHomePage() });
        context.res.end();
    }
    return {
        props: {},
    };
}

export default ProfileLibraryPage;
