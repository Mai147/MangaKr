import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import { Follow, UserModel } from "@/models/User";
import UserService from "@/services/UserService";
import {
    Flex,
    Avatar,
    VStack,
    Grid,
    Button,
    Text,
    Box,
    HStack,
    IconButton,
    Link,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsChat } from "react-icons/bs";

type ProfileHeaderProps = {
    user: UserModel;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
    const [follow, setFollow] = useState<Follow | undefined>();
    const [followLoading, setFollowLoading] = useState(true);
    const authState = useAuth();
    const { toggleView } = useModal();

    const getFollow = async (userId: string, followerId: string) => {
        setFollowLoading(true);
        const follow = await UserService.getFollow({
            userId,
            followerId,
        });
        setFollow(follow);
        setFollowLoading(false);
    };

    useEffect(() => {
        if (user && authState.user) {
            getFollow(authState.user.uid, user.uid);
        }
    }, [user, authState.user]);

    return (
        <Flex alignItems="center" direction="column" w="100%">
            <Avatar
                size={"2xl"}
                src={user.photoURL || ""}
                border="3px solid"
                borderColor="white"
                box-shadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
                referrerPolicy="no-referrer"
            />
            <VStack spacing={1} textAlign="center" w="100%" p={2}>
                <Text fontSize={24} fontWeight={700} lineHeight={1}>
                    {user.displayName}
                </Text>
                <Text fontSize={16} color="gray.400">
                    {user.email}
                </Text>
                <Text>{user.bio || "------"}</Text>
                <Grid
                    templateColumns={"repeat(3, minmax(0, 1fr))"}
                    px={{ base: 0, md: 6 }}
                    py={2}
                    gap={2}
                    w="100%"
                >
                    <Box>
                        <Text fontSize={24} fontWeight={500}>
                            {user.numberOfPosts}
                        </Text>
                        <Text>Bài viết</Text>
                    </Box>

                    <Box>
                        <Text fontSize={24} fontWeight={500}>
                            {user.numberOfFolloweds}
                        </Text>
                        <Text>Lượt theo dõi</Text>
                    </Box>
                    <Box>
                        <Text fontSize={24} fontWeight={500}>
                            {user.numberOfFollows}
                        </Text>
                        <Text>Đang theo dõi</Text>
                    </Box>
                </Grid>
                <VStack>
                    {user.uid !== authState.user?.uid &&
                        (follow && follow.isAccept === false ? (
                            <Text>Đã yêu cầu theo dõi</Text>
                        ) : (
                            <Button
                                w="32"
                                isLoading={followLoading}
                                onClick={async () => {
                                    if (!authState.user) {
                                        toggleView("login");
                                        return;
                                    }
                                    setFollowLoading(true);
                                    if (!follow) {
                                        const res = await UserService.follow({
                                            user: authState.user,
                                            follower: user,
                                        });
                                        setFollow(res);
                                    } else {
                                        await UserService.unfollow({
                                            userId: authState.user.uid,
                                            followerId: user.uid,
                                        });
                                        setFollow(undefined);
                                    }
                                    setFollowLoading(false);
                                }}
                            >
                                {!follow ? "Theo dõi" : "Hủy theo dõi"}
                            </Button>
                        ))}
                    {user.uid !== authState.user?.uid && (
                        <Link href={routes.getMessageDetailPage(user.uid)}>
                            <IconButton
                                fontSize={20}
                                aria-label="message"
                                icon={<BsChat />}
                                bg="blue.300"
                                _hover={{ bg: "blue.400" }}
                            />
                        </Link>
                    )}
                </VStack>
            </VStack>
        </Flex>
    );
};
export default ProfileHeader;
