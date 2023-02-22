import { Box } from "@chakra-ui/react";
import React from "react";

type RequiredLoginContainerProps = {
    action: string;
};

const RequiredLoginContainer: React.FC<RequiredLoginContainerProps> = ({
    action,
}) => {
    return (
        <Box p={6} boxShadow="md">
            Bạn cần phải đăng nhập để {action}
        </Box>
    );
};
export default RequiredLoginContainer;
