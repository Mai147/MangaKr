import { firebaseRoute } from "@/constants/firebaseRoutes";
import { WRITER_ROLE } from "@/constants/roles";
import { routes } from "@/constants/routes";
import { fireStore } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import { UserMessageSnippet } from "@/models/User";
import {
    Box,
    Flex,
    IconButton,
    Link,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@chakra-ui/react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import { RiChat3Line } from "react-icons/ri";
import NavAdd from "./NavAdd";
import NavNotification from "./NavNotification";
import NavSearch from "./NavSearch";
import NavUser from "./NavUser";

type NavRightContentProps = {};

const NavRightContent: React.FC<NavRightContentProps> = () => {
    const { user } = useAuth();
    const [numberOfNewMessage, setNumberOfNewMessage] = useState(0);

    useEffect(() => {
        if (user) {
            const q = query(
                collection(
                    fireStore,
                    firebaseRoute.getUserMessageRoute(user.uid)
                ),
                orderBy("latestCreatedAt", "desc")
            );
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                let numberOfNew = 0;
                querySnapshot.docs.forEach((doc) => {
                    const { numberOfUnseens } =
                        doc.data() as UserMessageSnippet;
                    numberOfNew += numberOfUnseens > 0 ? 1 : 0;
                });
                setNumberOfNewMessage(numberOfNew);
            });
            return unsubscribe;
        }
    }, [user]);

    return (
        <Flex align="center">
            <Flex display={{ base: "none", lg: "flex" }} mr={2}>
                <NavSearch />
            </Flex>

            <Flex display={{ base: "none", sm: "flex" }} align="center">
                {user && (
                    <>
                        <Popover trigger={"hover"} placement={"bottom-start"}>
                            <PopoverTrigger>
                                <IconButton
                                    size="lg"
                                    variant="ghost"
                                    aria-label="add"
                                    borderRadius="full"
                                    icon={<AiOutlinePlus />}
                                />
                            </PopoverTrigger>

                            <PopoverContent
                                border={0}
                                boxShadow="md"
                                bg="white"
                                p={4}
                                rounded={"xl"}
                                minW={"xs"}
                            >
                                <NavAdd />
                            </PopoverContent>
                        </Popover>
                        <NavNotification />
                        <Link href={routes.getMessagePage()}>
                            <Box position="relative">
                                <IconButton
                                    size="lg"
                                    variant="ghost"
                                    aria-label="Notification"
                                    borderRadius="full"
                                    icon={<RiChat3Line />}
                                />
                                {numberOfNewMessage > 0 && (
                                    <Flex
                                        w="4"
                                        h="4"
                                        rounded="full"
                                        bg="red"
                                        position="absolute"
                                        bottom="2"
                                        right="2"
                                        color="white"
                                        fontSize={10}
                                        fontWeight={500}
                                        align="center"
                                        justify="center"
                                    >
                                        {numberOfNewMessage <= 99
                                            ? numberOfNewMessage
                                            : `99+`}
                                    </Flex>
                                )}
                            </Box>
                        </Link>
                    </>
                )}
                {user && user.role === WRITER_ROLE && (
                    <Link href={routes.getWriterPage()}>
                        <IconButton
                            size="lg"
                            variant="ghost"
                            aria-label="Edit"
                            borderRadius="full"
                            icon={<AiOutlineEdit />}
                        />
                    </Link>
                )}
            </Flex>
            <NavUser />
        </Flex>
    );
};
export default NavRightContent;
