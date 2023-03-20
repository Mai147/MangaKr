import LibraryBook from "@/components/Library/Book";
import LibraryReview from "@/components/Library/Review";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { HOME_PAGE } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { Box, Divider } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect, useState } from "react";

type ProfileLibaryPageProps = {};

const ProfileLibraryPage: React.FC<ProfileLibaryPageProps> = () => {
    const { setDefaultPath, setNeedAuth } = useAuth();
    const [confirmTitle, setConfirmTitle] = useState("");
    const [confirmContent, setConfirmContent] = useState("");
    const [confirmSubmitFunc, setConfirmSubmitFunc] = useState<
        () => () => Promise<void>
    >(() => async () => {});

    useEffect(() => {
        setNeedAuth(true);
        setDefaultPath(HOME_PAGE);
    }, []);

    return (
        <Box>
            <ConfirmModal
                title={confirmTitle}
                content={confirmContent}
                onSubmit={async () => {
                    confirmSubmitFunc();
                }}
            />
            <LibraryBook
                setConfirmContent={setConfirmContent}
                setConfirmSubmitFunc={setConfirmSubmitFunc}
                setConfirmTitle={setConfirmTitle}
            />
            <Divider my={4} />
            <LibraryReview
                setConfirmContent={setConfirmContent}
                setConfirmSubmitFunc={setConfirmSubmitFunc}
                setConfirmTitle={setConfirmTitle}
            />
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
