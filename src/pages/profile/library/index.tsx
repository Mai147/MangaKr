import LibraryAuthor from "@/components/Library/Author";
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
    const [confirmSubContent, setConfirmSubContent] = useState("");
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
            <Divider my={4} borderColor="gray.400" />
            <LibraryAuthor
                setConfirmContent={setConfirmContent}
                setConfirmSubmitFunc={setConfirmSubmitFunc}
                setConfirmSubContent={setConfirmSubContent}
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
