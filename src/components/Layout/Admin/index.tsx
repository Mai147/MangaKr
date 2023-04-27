import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import AdminSidebar from "./Sidebar";

type LayoutAdminProps = {
    children: ReactNode;
};

const LayoutAdmin: React.FC<LayoutAdminProps> = ({ children }) => {
    return (
        <Box>
            <AdminSidebar>{children}</AdminSidebar>
        </Box>
    );
};
export default LayoutAdmin;
