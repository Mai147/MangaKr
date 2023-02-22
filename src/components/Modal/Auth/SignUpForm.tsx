import { Button, Flex, Icon, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import useModal from "@/hooks/useModal";
import { auth, fireStore } from "@/firebase/clientApp";
import { USER_ROLE } from "@/constants/roles";
import { FiEye, FiEyeOff } from "react-icons/fi";
import ErrorText from "./ErrorText";
import ModalInputItem from "../ModalInputItem";
import { ValidationError } from "@/constants/validation";
import { validateSignUp } from "@/validation/authValidation";
import { firebaseRoute } from "@/constants/firebaseRoutes";

type Props = {};

const SignUpForm: React.FC<Props> = () => {
    const { toggleView } = useModal();
    const [signUpForm, setSignUpForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [createUserWithEmailAndPassword, userCred, loading, userError] =
        useCreateUserWithEmailAndPassword(auth);
    const [isShowPassword, setIsShowPassword] = useState<boolean[]>([]);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (errors) setErrors([]);
        const res = validateSignUp(
            signUpForm.email,
            signUpForm.password,
            signUpForm.confirmPassword
        );
        if (!res.result) {
            setErrors(res.errors);
        } else {
            await createUserWithEmailAndPassword(
                signUpForm.email,
                signUpForm.password
            );
            toggleView("login");
        }
    };

    const onChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (errors) {
            const errorIdx = errors.findIndex(
                (e) => e.field === event.target.name
            );
            if (errorIdx > -1) {
                setErrors((prev) => prev.splice(errorIdx, 1));
            }
        }
        setSignUpForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const createUserDocument = async (user: User) => {
        await setDoc(
            doc(fireStore, firebaseRoute.getAllUserRoute(), user?.uid),
            {
                ...JSON.parse(JSON.stringify(user)),
                role: USER_ROLE,
                displayName: user.displayName || user.email?.split("@")[0],
            }
        );
    };

    useEffect(() => {
        if (userCred) {
            createUserDocument(userCred.user);
        }
    }, [userCred]);

    return (
        <form onSubmit={onSubmit} style={{ width: "100%" }}>
            <ModalInputItem
                required={true}
                name="email"
                placeholder="Email"
                type="email"
                value={signUpForm.email}
                onChange={onChange}
                isInvalid={!!errors.find((error) => error.field === "email")}
            />
            <ErrorText
                error={errors.find((error) => error.field === "email")?.message}
            />
            <ModalInputItem
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
                isInvalid={!!errors.find((error) => error.field === "password")}
            />
            <ErrorText
                error={
                    errors.find((error) => error.field === "password")?.message
                }
            />
            <ModalInputItem
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
                isInvalid={
                    !!errors.find((error) => error.field === "confirmPassword")
                }
            />
            <ErrorText
                error={
                    errors.find((error) => error.field === "confirmPassword")
                        ?.message
                }
            />
            <ErrorText userError={userError} />
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
