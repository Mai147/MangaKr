import {
    EVERYONE_PRIVACY,
    FOLLOW_PRIVACY,
    ONLYME_PRIVACY,
} from "@/constants/privacy";
import { UserModel } from "@/models/User";
import {
    Box,
    Divider,
    Flex,
    Radio,
    RadioGroup,
    Text,
    VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";

type ProfileSettingProps = {
    user: UserModel;
};

const privacyList = [
    {
        value: EVERYONE_PRIVACY,
        title: "Mọi người",
        content: "(Bất kì ai đều có thể xem bài viết của bạn)",
    },
    {
        value: FOLLOW_PRIVACY,
        title: "Bạn bè",
        content: "(Chỉ người theo dõi có thể xem bài viết của bạn)",
    },
    {
        value: ONLYME_PRIVACY,
        title: "Chỉ mình tôi",
        content: "(Chỉ bạn có thể xem bài viết của bạn)",
    },
];

const ProfileSetting: React.FC<ProfileSettingProps> = ({ user }) => {
    const [value, setValue] = useState(EVERYONE_PRIVACY);
    return (
        <Box flexGrow={1} width="100%">
            <Flex justify="space-between" align="flex-end">
                <VStack
                    spacing={0}
                    justify="flex-start"
                    alignItems="flex-start"
                >
                    <Text fontWeight={500} fontSize={18}>
                        Cài đặt
                    </Text>
                </VStack>
            </Flex>
            <Divider my={4} />
            <Box>
                <Text fontWeight={500} mb={2}>
                    Hiển thị bài viết
                </Text>
                <RadioGroup onChange={setValue} value={value} colorScheme="red">
                    <VStack align="flex-start">
                        {privacyList.map((item) => (
                            <Flex key={item.value}>
                                <Radio size="md" value={item.value}>
                                    {item.title}
                                </Radio>
                                <Text color="gray.400" ml={2}>
                                    {item.content}
                                </Text>
                            </Flex>
                        ))}
                    </VStack>
                </RadioGroup>
            </Box>
        </Box>
    );
};
export default ProfileSetting;
