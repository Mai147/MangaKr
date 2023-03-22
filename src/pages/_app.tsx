import { theme } from "@/chakra/theme";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/context/AuthContext";
import { ModalProvider } from "@/context/ModalContext";
import "@/styles/globals.css";
import "@/styles/ckeditor.css";
import { ChakraProvider } from "@chakra-ui/react";

import type { AppProps } from "next/app";
import { CommunityProvider } from "@/context/CommunityContext";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider theme={theme}>
            <AuthProvider>
                <ModalProvider>
                    <CommunityProvider>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </CommunityProvider>
                </ModalProvider>
            </AuthProvider>
        </ChakraProvider>
    );
}
