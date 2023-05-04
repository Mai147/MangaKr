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
                bg={useColorModeValue("#FAFAFA", "gray.900")}
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
                    p={{ base: 0, md: 4 }}
                    px={{ base: 0, md: 18, lg: 24, xl: 32 }}
                    // px={{ base: 0, md: 14, lg: 18, xl: 20, "2xl": 32 }}
                    flexGrow={1}
                    bg="#FAFAFA"
                    pt={{ base: "80px !important", md: "100px !important" }}
                >
                    {children}
                </Flex>
                <Footer />
            </Flex>
        </>
    );
};
export default Layout;
