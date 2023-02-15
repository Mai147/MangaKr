import useModal from "@/hooks/useModal";
import { HStack, Button } from "@chakra-ui/react";
import React from "react";

type AuthButtonsProps = {};

const AuthButtons: React.FC<AuthButtonsProps> = () => {
    const { toggleView } = useModal();
    return (
        <HStack spacing={2}>
            <Button
                w={28}
                variant="outline"
                onClick={() => toggleView("login")}
            >
                Đăng nhập
            </Button>
            <Button w={28} onClick={() => toggleView("signup")}>
                Đăng ký
            </Button>
        </HStack>
    );
};
export default AuthButtons;
