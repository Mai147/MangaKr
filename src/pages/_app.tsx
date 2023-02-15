import { theme } from "@/chakra/theme";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/context/AuthContext";
import { ModalProvider } from "@/context/ModalContext";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider theme={theme}>
            <AuthProvider>
                <ModalProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ModalProvider>
            </AuthProvider>
        </ChakraProvider>
    );
}
