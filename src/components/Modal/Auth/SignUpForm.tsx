import { Button, Flex, Icon, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import useModal from "@/hooks/useModal";
import { auth, fireStore } from "@/firebase/clientApp";
import AuthInputItem from "./AuthInputItem";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import { signUpValidation } from "@/validation/authValidation";
import { USER_ROLE } from "@/constants/roles";
import { getAllUserRoute } from "@/constants/firebaseRoutes";
import { FiEye, FiEyeOff } from "react-icons/fi";
import ErrorText from "./ErrorText";

type Props = {};

const SignUpForm: React.FC<Props> = () => {
    const { toggleView } = useModal();
    const [signUpForm, setSignUpForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [createUserWithEmailAndPassword, userCred, loading, userError] =
        useCreateUserWithEmailAndPassword(auth);
    const [isShowPassword, setIsShowPassword] = useState<boolean[]>([]);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (error) setError("");
        const { result, message } = signUpValidation(
            signUpForm.email,
            signUpForm.password,
            signUpForm.confirmPassword
        );
        if (!result) {
            setError(message!);
        } else {
            await createUserWithEmailAndPassword(
                signUpForm.email,
                signUpForm.password
            );
            toggleView("login");
        }
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSignUpForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const createUserDocument = async (user: User) => {
        await setDoc(doc(fireStore, getAllUserRoute(), user?.uid), {
            ...JSON.parse(JSON.stringify(user)),
            role: USER_ROLE,
            displayName: user.displayName || user.email?.split("@")[0],
        });
    };

    useEffect(() => {
        if (userCred) {
            createUserDocument(userCred.user);
        }
    }, [userCred]);

    return (
        <form onSubmit={onSubmit} style={{ width: "100%" }}>
            <AuthInputItem
                required={true}
                name="email"
                placeholder="Email"
                type="email"
                value={signUpForm.email}
                onChange={onChange}
            />
            <AuthInputItem
                required={true}
                name="password"
                placeholder="Mật khẩu"
                type={isShowPassword[0] ? "text" : "password"}
                value={signUpForm.password}
                onChange={onChange}
                rightElement={
                    <Icon
                        as={isShowPassword[0] ? FiEye : FiEyeOff}
                        cursor="pointer"
                        onClick={() =>
                            setIsShowPassword((prev) => [!prev[0], prev[1]])
                        }
                    />
                }
            />
            <AuthInputItem
                required={true}
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                type={isShowPassword[1] ? "text" : "password"}
                value={signUpForm.confirmPassword}
                onChange={onChange}
                rightElement={
                    <Icon
                        as={isShowPassword[1] ? FiEye : FiEyeOff}
                        cursor="pointer"
                        onClick={() =>
                            setIsShowPassword((prev) => [prev[0], !prev[1]])
                        }
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
                Đăng ký
            </Button>
            <Flex fontSize="9pt" justifyContent="center">
                <Text mr={2}>Đã có tài khoản?</Text>
                <Text
                    color="blue.500"
                    fontWeight={700}
                    cursor="pointer"
                    onClick={() => toggleView("login")}
                >
                    Đăng nhập?
                </Text>
            </Flex>
        </form>
    );
};

export default SignUpForm;
