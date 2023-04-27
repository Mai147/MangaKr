import AdminPostApprove from "@/components/Admin/Post/PostApprove";
import { Flex } from "@chakra-ui/react";
import React from "react";

type AdminPostPageProps = {};

const AdminPostPage: React.FC<AdminPostPageProps> = () => {
    return (
        <Flex
            direction="column"
            p={0}
            boxShadow="lg"
            bg="white"
            borderRadius={8}
            flexGrow={1}
        >
            <AdminPostApprove />
        </Flex>
    );
};
export default AdminPostPage;
