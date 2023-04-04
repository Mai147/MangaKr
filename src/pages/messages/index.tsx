import MessageHeader from "@/components/Message/MessageHeader";
import MessageLeftSideBar from "@/components/Message/LeftSideBar";
import { routes } from "@/constants/routes";
import { UserModel } from "@/models/User";
import UserService from "@/services/UserService";
import { Divider, Flex, VStack } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect, useState } from "react";
import MessageList from "@/components/Message/MessageList";
import { MessageProvider } from "@/context/MessageContext";
import MessageInput from "@/components/Message/Input";
import useAuth from "@/hooks/useAuth";

type MessagePageProps = {};

const MessagePage: React.FC<MessagePageProps> = () => {
    const { setDefaultPath, setNeedAuth } = useAuth();

    useEffect(() => {
        setNeedAuth(true);
        setDefaultPath(routes.getHomePage());
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
    if (token) {
        return {
            props: {},
        };
    } else {
        context.res.writeHead(302, { Location: routes.getHomePage() });
        context.res.end();
    }
}

export default MessagePage;
