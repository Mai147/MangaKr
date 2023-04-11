import { Button, Flex, Image } from "@chakra-ui/react";
import React from "react";
import { auth } from "@/firebase/clientApp";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import ErrorText from "./ErrorText";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import UserService from "@/services/UserService";

const OAuthButtons: React.FC = () => {
    const { authAction } = useAuth();
    const [loginWithGoogle, userCred, loading, error] =
        useSignInWithGoogle(auth);
    const { closeModal } = useModal();

    return (
        <Flex direction="column" width="100%" mb={4}>
            <Button
                variant="oauth"
                mb={2}
                isLoading={loading}
                onClick={async () => {
                    const res = await loginWithGoogle();
                    if (res) {
                        await UserService.create({ user: res.user });
                        await authAction.login(res.user);
                        closeModal();
                    }
                }}
            >
                <Image src="/images/googlelogo.png" height={"20px"} mr={2} />
                Đăng nhập với Google
            </Button>
            <ErrorText userError={error} />
        </Flex>
    );
};

export default OAuthButtons;
