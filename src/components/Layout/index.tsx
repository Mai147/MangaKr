import {
    useColorModeValue,
    Drawer,
    DrawerContent,
    Box,
    useDisclosure,
    Flex,
} from "@chakra-ui/react";
import React, { ReactNode } from "react";
import AuthModal from "../Modal/Auth";
import CreateCommunityModal from "../Modal/Community/CreateCommunityModal";
import Footer from "./Footer";
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
            <CreateCommunityModal />
            <Flex
                direction="column"
                minH="100vh"
                bg={useColorModeValue("gray.100", "gray.900")}
            >
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
                <Flex
                    direction="column"
                    p={4}
                    px={{ base: 4, md: 24, xl: 32 }}
                    flexGrow={1}
                    bg="gray.100"
                    pt={"100px"}
                >
                    {children}
                </Flex>
                <Footer />
            </Flex>
        </>
    );
};
export default Layout;
