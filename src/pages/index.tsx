import Head from "next/head";
import { Inter } from "@next/font/google";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import Home from "@/components/Home";
import { HomeProvider } from "@/context/HomeContext";

type HomePageProps = {};

const HomePage: React.FC<HomePageProps> = () => {
    const { authAction } = useAuth();
    useEffect(() => {
        authAction.setNeedAuth(false);
    }, []);
    return (
        <>
            <Head>
                <title>MangaKr - Trang chủ</title>
            </Head>
            <>
                <HomeProvider>
                    <Home />
                </HomeProvider>
            </>
        </>
    );
};

export default HomePage;
