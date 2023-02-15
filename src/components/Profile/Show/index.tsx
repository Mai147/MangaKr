import { UserModel } from "@/models/User";
import { Avatar, Box, Divider, Flex, Text, VStack } from "@chakra-ui/react";
import React from "react";

type ProfileShowProps = {
    user: UserModel;
};

const ProfileShow: React.FC<ProfileShowProps> = ({ user }) => {
    return (
        <Flex direction="column" align="flex-start">
            <Flex alignItems="center">
                <Avatar
                    size={"2xl"}
                    src={user.photoURL || ""}
                    border="3px solid"
                    borderColor="white"
                    box-shadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
                    mr={6}
                    referrerPolicy="no-referrer"
                />
                <VStack spacing={0} alignItems="flex-start">
                    <VStack spacing={-2} align="flex-start">
                        <Text fontSize={24} fontWeight={700}>
                            {user.displayName}
                        </Text>
                        <Text fontSize={16} color="gray.400">
                            {user.email}
                        </Text>
                    </VStack>
                    <Text color="gray.600">{user.subBio}</Text>
                </VStack>
            </Flex>
            <Divider my={4} />
            <VStack align="flex-start">
                <Text fontSize={24} fontWeight={700}>
                    Bio
                </Text>
                <Text>{user.bio || "Không"}</Text>
            </VStack>
        </Flex>
    );
};
export default ProfileShow;
