import {
    useColorModeValue,
    Drawer,
    DrawerContent,
    Box,
    useDisclosure,
} from "@chakra-ui/react";
import React, { ReactNode } from "react";
import AuthModal from "../Modal/Auth";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

type LayoutProps = {
    children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <AuthModal />
            <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
                <Drawer
                    autoFocus={false}
                    isOpen={isOpen}
                    placement="left"
                    onClose={onClose}
                    returnFocusOnClose={false}
                    onOverlayClick={onClose}
                    size="full"
                >
                    <DrawerContent>
                        <Sidebar onClose={onClose} />
                    </DrawerContent>
                </Drawer>
                {/* mobilenav */}
                <Navbar onOpen={onOpen} />
                <Box p={4} px={{ base: 4, md: 30, lg: 40 }}>
                    {children}
                </Box>
            </Box>
        </>
    );
};
export default Layout;
