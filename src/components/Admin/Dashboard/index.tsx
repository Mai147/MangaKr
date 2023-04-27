import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import SummarySection from "./Summary";
import TopSection from "./Top";

type AdminDashboardProps = {};

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
    return (
        <Box>
            <SummarySection />
            <TopSection />
        </Box>
    );
};
export default AdminDashboard;
