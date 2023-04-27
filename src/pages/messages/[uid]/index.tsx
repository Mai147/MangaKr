import MessageHeader from "@/components/Message/MessageHeader";
import MessageLeftSideBar from "@/components/Message/LeftSideBar";
import { routes } from "@/constants/routes";
import { Flex, VStack } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect } from "react";
import MessageList from "@/components/Message/MessageList";
import { MessageProvider } from "@/context/MessageContext";
import MessageInput from "@/components/Message/Input";
import useAuth from "@/hooks/useAuth";
import UserService from "@/services/UserService";
import { UserModel } from "@/models/User";

type MessagePageProps = {
    user: UserModel | null;
};

const MessagePage: React.FC<MessagePageProps> = ({ user }) => {
    const { authAction } = useAuth();

    useEffect(() => {
        authAction.setNeedAuth(true);
        authAction.setDefaultPath(routes.getHomePage());
    }, []);

    return (
        <MessageProvider>
            <Flex bg="white" flexGrow={1} h="100vh">
                <MessageLeftSideBar />
                <VStack spacing={0} flexGrow={1} align="flex-start">
                    <MessageHeader />
                    <MessageList />
                    <MessageInput />
                </VStack>
            </Flex>
        </MessageProvider>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token } = cookies(context) || null;
    const { uid } = context.query;
    const user = await UserService.get({ userId: uid as string });
    if (token) {
        return {
            props: {
                user: user ? JSON.parse(JSON.stringify(user)) : null,
            },
        };
    } else {
        context.res.writeHead(302, { Location: routes.getHomePage() });
        context.res.end();
    }
}

export default MessagePage;
