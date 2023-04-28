import InputText from "@/components/Input/InputText";
import ErrorText from "@/components/Modal/Auth/ErrorText";
import OAuthButtons from "@/components/Modal/Auth/OAuthButtons";
import { ADMIN_ROLE } from "@/constants/roles";
import { routes } from "@/constants/routes";
import { ValidationError } from "@/constants/validation";
import { auth } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import { validateLogin } from "@/validation/authValidation";
import {
    Box,
    Button,
    Divider,
    Flex,
    Image,
    Text,
    VStack,
} from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";

type AdminLoginPageProps = {};

const AdminLoginPage: React.FC<AdminLoginPageProps> = () => {
    const [loginWithEmailAndPassword, user, loading, userError] =
        useSignInWithEmailAndPassword(auth);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const { authAction } = useAuth();
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    });
    const router = useRouter();
    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (errors) setErrors([]);
        const res = validateLogin(loginForm.email, loginForm.password);
        if (res.result) {
            const res = await loginWithEmailAndPassword(
                loginForm.email,
                loginForm.password
            );
            if (res) {
                const user = await authAction.login(res.user);
                if (!user || user.role !== ADMIN_ROLE) {
                    setErrors([
                        {
                            field: "all",
                            message: "Not admin",
                        },
                    ]);
                    await authAction.logout();
                } else {
                    router.push(routes.getAdminPage());
                }
            }
        } else {
            setErrors(res.errors);
        }
    };

    const onChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setLoginForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };
    return (
        <>
            <Head>
                <title>MangaKr - Admin - Đăng nhập</title>
            </Head>
            <>
                <Flex justify="center" align="center" minH="100vh" px={24}>
                    <Flex direction="column" w="33%" mr={24} flexShrink={0}>
                        <Text fontSize={24} fontWeight={600} mb={4}>
                            Đăng nhập hệ thống
                        </Text>
                        <form onSubmit={onSubmit} style={{ width: "100%" }}>
                            <OAuthButtons />
                            <Text
                                color="gray.500"
                                fontWeight={700}
                                mb={4}
                                textAlign="center"
                            >
                                Hoặc
                            </Text>
                            <Divider my={4} />
                            <VStack w="100%" spacing={4}>
                                <Box w="100%">
                                    <Text fontWeight={500} mb={2}>
                                        Email:
                                    </Text>
                                    <InputText
                                        name="email"
                                        value={loginForm.email}
                                        type="email"
                                        required
                                        onInputChange={onChange}
                                        isInvalid={
                                            !!errors.find(
                                                (error) =>
                                                    error.field === "email"
                                            )
                                        }
                                    />
                                </Box>
                                <Box w="100%">
                                    <Text fontWeight={500} mb={2}>
                                        Mật khẩu:
                                    </Text>
                                    <InputText
                                        name="password"
                                        value={loginForm.password}
                                        type="password"
                                        required
                                        onInputChange={onChange}
                                        isInvalid={
                                            !!errors.find(
                                                (error) =>
                                                    error.field === "password"
                                            )
                                        }
                                    />
                                </Box>
                                <ErrorText
                                    error={
                                        errors.length > 0
                                            ? "Tài khoản hoặc mật khẩu không chính xác"
                                            : ""
                                    }
                                    userError={userError}
                                />
                                <Button
                                    width={"100%"}
                                    height="36px"
                                    mt={2}
                                    mb={2}
                                    type="submit"
                                    isLoading={loading}
                                >
                                    Đăng nhập
                                </Button>
                            </VStack>
                        </form>
                    </Flex>
                    <Image
                        src="/images/noImage.jpg"
                        flexGrow={1}
                        objectFit="cover"
                        maxH="80vh"
                    />
                </Flex>
            </>
        </>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user } = cookies(context) || null;
    if (token) {
        const us = JSON.parse(JSON.stringify(user));
        if (us.role === ADMIN_ROLE) {
            context.res.writeHead(302, {
                Location: routes.getAdminPage(),
            });
            context.res.end();
        }
    }

    return {
        props: {},
    };
}

export default AdminLoginPage;
