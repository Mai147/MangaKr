import { routes } from "@/constants/routes";
import { Button, Flex, Icon, Link, Text } from "@chakra-ui/react";
import React from "react";
import { CgUnavailable } from "react-icons/cg";

type NotAvailableProps = {
    title: string;
};

const NotAvailable: React.FC<NotAvailableProps> = ({ title }) => {
    return (
        <Flex align="center" justify="center" direction="column" flexGrow={1}>
            <Icon as={CgUnavailable} fontSize={60} color="brand.100" />
            <Text fontSize={24} fontWeight={600}>
                {title}
            </Text>
            <Link
                href={routes.getHomePage()}
                _hover={{ textDecoration: "none" }}
                mt={4}
            >
                <Button>Trở về trang chủ</Button>
            </Link>
        </Flex>
    );
};
export default NotAvailable;
