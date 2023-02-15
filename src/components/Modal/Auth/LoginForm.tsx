import { Button, Flex, Icon, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { auth } from "@/firebase/clientApp";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import useModal from "@/hooks/useModal";
import AuthInputItem from "./AuthInputItem";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { loginValidation } from "@/validation/authValidation";
import ErrorText from "./ErrorText";
import useAuth from "@/hooks/useAuth";

type LoginFormProps = {};

const LoginForm: React.FC<LoginFormProps> = () => {
    const { toggleView } = useModal();
    const [loginWithEmailAndPassword, user, loading, userError] =
        useSignInWithEmailAndPassword(auth);
    const { login } = useAuth();
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (error) setError("");
        const { result, message } = loginValidation(
            loginForm.email,
            loginForm.password
        );
        if (result) {
            const res = await loginWithEmailAndPassword(
                loginForm.email,
                loginForm.password
            );
            if (res) {
                login(res.user);
            }
        } else {
            setError(message || "");
        }
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };
    return (
        <form onSubmit={onSubmit} style={{ width: "100%" }}>
            <AuthInputItem
                required={true}
                name="email"
                placeholder="Email"
                type="email"
                value={loginForm.email}
                onChange={onChange}
            />
            <AuthInputItem
                required={true}
                name="password"
                placeholder="Mật khẩu"
                type={isShowPassword ? "text" : "password"}
                value={loginForm.password}
                onChange={onChange}
                rightElement={
                    <Icon
                        as={isShowPassword ? FiEye : FiEyeOff}
                        cursor="pointer"
                        onClick={() => setIsShowPassword((prev) => !prev)}
                    />
                }
            />
            <ErrorText error={error} userError={userError} />
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
            {/* <Flex justifyContent="center" mb={2}>
                <Text fontSize="9pt" mr={1}>
                    Forgot your password?
                </Text>
                <Text
                    fontSize="9pt"
                    color="blue.500"
                    cursor="pointer"
                    onClick={() => toggleView("resetPassword")}
                >
                    Reset
                </Text>
            </Flex> */}
            <Flex fontSize="9pt" justifyContent="center">
                <Text mr={2}>Chưa có tài khoản?</Text>
                <Text
                    color="blue.500"
                    fontWeight={700}
                    cursor="pointer"
                    onClick={() => toggleView("signup")}
                >
                    Đăng ký?
                </Text>
            </Flex>
        </form>
    );
};

export default LoginForm;
