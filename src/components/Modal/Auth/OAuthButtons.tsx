import { Button, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { auth, fireStore } from "@/firebase/clientApp";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { USER_ROLE } from "@/constants/roles";
import ErrorText from "./ErrorText";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import { firebaseRoute } from "@/constants/firebaseRoutes";

const OAuthButtons: React.FC = () => {
    const { login } = useAuth();
    const [loginWithGoogle, userCred, loading, error] =
        useSignInWithGoogle(auth);
    const { closeModal } = useModal();

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
        <Flex direction="column" width="100%" mb={4}>
            <Button
                variant="oauth"
                mb={2}
                isLoading={loading}
                onClick={async () => {
                    const res = await loginWithGoogle();
                    if (res) {
                        await login(res.user);
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
