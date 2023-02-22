import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import {
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import LoginForm from "./LoginForm";
import OAuthButtons from "./OAuthButtons";
import SignUpForm from "./SignUpForm";
// import ResetPassword from "./ResetPassword";

const AuthModal: React.FC = () => {
    const { isOpen, view, closeModal } = useModal();
    const { user } = useAuth();

    useEffect(() => {
        if (user) closeModal();
    }, [user]);

    return (
        <>
            <Modal
                isOpen={isOpen && (view === "login" || view === "signup")}
                onClose={closeModal}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign={"center"}>
                        {view === "login" && "Đăng nhập"}
                        {view === "signup" && "Đăng ký"}
                        {/* {modalState.view === "resetPassword" &&
                            "Reset Password"} */}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        pb={6}
                    >
                        <Flex
                            direction="column"
                            align="center"
                            justify="center"
                            width={{ base: "90%", md: "70%" }}
                        >
                            {view === "login" || view === "signup" ? (
                                <>
                                    <OAuthButtons />
                                    <Text
                                        color="gray.500"
                                        fontWeight={700}
                                        mb={8}
                                    >
                                        Hoặc
                                    </Text>
                                    {view === "login" && <LoginForm />}
                                    {view === "signup" && <SignUpForm />}
                                </>
                            ) : (
                                <></>
                                // <ResetPassword />
                            )}
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default AuthModal;
