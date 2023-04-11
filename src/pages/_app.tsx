import { theme } from "@/chakra/theme";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/context/AuthContext";
import { ModalProvider } from "@/context/ModalContext";
import "@/styles/globals.css";
import "@/styles/ckeditor.css";
import { ChakraProvider } from "@chakra-ui/react";

import type { AppProps } from "next/app";
import { CommunityProvider } from "@/context/CommunityContext";
import React from "react";
// import { PostProvider } from "@/context/PostContext";

export default function App({ Component, pageProps, ...appProps }: AppProps) {
    const isLayoutNeeded = ![`/messages`, `/messages/[uid]`].includes(
        appProps.router.pathname
    );

    const LayoutComponent = isLayoutNeeded ? Layout : React.Fragment;

    return (
        <ChakraProvider theme={theme}>
            <AuthProvider>
                <ModalProvider>
                    <CommunityProvider>
                        {/* <PostProvider> */}
                        <LayoutComponent>
                            <Component {...pageProps} />
                        </LayoutComponent>
                        {/* </PostProvider> */}
                    </CommunityProvider>
                </ModalProvider>
            </AuthProvider>
        </ChakraProvider>
    );
}
