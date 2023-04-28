import InputField from "@/components/Input/InputField";
import InputText from "@/components/Input/InputText";
import useAuth from "@/hooks/useAuth";
import useSelectFile from "@/hooks/useSelectFile";
import { UserModel } from "@/models/User";
import UserService from "@/services/UserService";
import {
    Flex,
    VStack,
    Button,
    Divider,
    Box,
    Text,
    Avatar,
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    CloseButton,
} from "@chakra-ui/react";
import { getAuth } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";

type ProfileDetailProps = {
    user: UserModel;
};

export type ProfileFormState = {
    id?: string;
    photoUrl?: string | null;
    email: string;
    displayName: string;
    bio?: string;
    imageRef?: string;
};

const defaultProfileFormState: ProfileFormState = {
    photoUrl: null,
    email: "",
    displayName: "",
};

const ProfileDetail: React.FC<ProfileDetailProps> = ({ user }) => {
    const { authAction } = useAuth();
    const { selectedFile, onSelectFile, setSelectedFile } = useSelectFile();
    const avatarRef = useRef<HTMLInputElement>(null);
    const [profileForm, setProfileForm] = useState<ProfileFormState>(
        defaultProfileFormState
    );
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<boolean | null>(null);

    useEffect(() => {
        setProfileForm({
            id: user.uid,
            photoUrl: user.photoURL,
            displayName: user.displayName!,
            email: user.email!,
            bio: user.bio,
            imageRef: user.imageRef,
        });
        setSelectedFile(user.photoURL || undefined);
    }, [user]);

    useEffect(() => {
        setProfileForm((prev) => ({
            ...prev,
            photoUrl: selectedFile,
        }));
    }, [selectedFile]);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setSuccess(null);
        try {
            const auth = getAuth();
            if (auth.currentUser) {
                const res = await UserService.update({
                    user: auth.currentUser,
                    profileForm,
                    avatarChange: selectedFile !== auth.currentUser.photoURL,
                });
                if (res) {
                    authAction.updateUser({
                        ...profileForm,
                        photoUrl: res.photoUrl,
                    });
                    setSuccess(true);
                } else {
                    setSuccess(false);
                }
            }
        } catch (error) {
            setSuccess(false);
            console.log(error);
        }
        setLoading(false);
    };

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setProfileForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    return (
        <Box flexGrow={1} width="100%">
            {success && (
                <Alert status="success" mb={4} justifyContent="space-between">
                    <Flex align="center">
                        <AlertIcon />
                        <Box>
                            <AlertTitle>Thành công!</AlertTitle>
                            <AlertDescription>
                                Thông tin của bạn đã được thay đổi
                            </AlertDescription>
                        </Box>
                    </Flex>
                    <CloseButton
                        alignSelf="flex-start"
                        position="relative"
                        right={-1}
                        top={-1}
                        onClick={() => setSuccess(null)}
                    />
                </Alert>
            )}
            {success !== null && !success && (
                <Alert status="error" mb={4} justifyContent="space-between">
                    <Flex align="center">
                        <AlertIcon />
                        <Box>
                            <AlertTitle>Thất bại!</AlertTitle>
                            <AlertDescription>
                                Có lỗi xảy ra vui lòng thử lại
                            </AlertDescription>
                        </Box>
                    </Flex>
                    <CloseButton
                        alignSelf="flex-start"
                        position="relative"
                        right={-1}
                        top={-1}
                        onClick={() => setSuccess(null)}
                    />
                </Alert>
            )}
            <form onSubmit={onSubmit}>
                <Flex justify="space-between" align="flex-end">
                    <VStack
                        spacing={0}
                        justify="flex-start"
                        alignItems="flex-start"
                    >
                        <Text fontWeight={500} fontSize={{ base: 16, md: 18 }}>
                            Thông tin cá nhân
                        </Text>
                        <Text
                            fontSize={{ base: 12, md: 14 }}
                            color="gray.400"
                            display={{ base: "none", sm: "unset" }}
                        >
                            Thay đổi avatar và thông tin cá nhân tại đây
                        </Text>
                    </VStack>
                    <Button
                        width={{ base: 20, md: 28 }}
                        size={{ base: "sm", sm: "md" }}
                        type="submit"
                        isLoading={loading}
                    >
                        Lưu
                    </Button>
                </Flex>
                <Divider my={4} />
                <Box>
                    <Flex
                        alignItems={{ base: "flex-start", md: "center" }}
                        py={2}
                        direction={{ base: "column", md: "row" }}
                    >
                        <Box
                            width={{ base: "150px", md: "143px", lg: "197px" }}
                        >
                            <Text>Avatar</Text>
                        </Box>
                        <Flex align="center">
                            <Avatar
                                size={"lg"}
                                src={selectedFile}
                                border="3px solid"
                                borderColor="white"
                                box-shadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
                                mr={6}
                                referrerPolicy="no-referrer"
                            />
                            <Button
                                variant="outline"
                                onClick={() => avatarRef.current?.click()}
                            >
                                Thay đổi
                            </Button>
                            <input
                                type="file"
                                hidden
                                ref={avatarRef}
                                onChange={onSelectFile}
                                accept="image/*"
                            />
                        </Flex>
                    </Flex>
                    <InputField label="Email">
                        <InputText
                            name="email"
                            value={profileForm.email}
                            type="email"
                            readonly={true}
                            onInputChange={handleChange}
                        />
                    </InputField>
                    <InputField label="Tên hiển thị" required>
                        <InputText
                            name="displayName"
                            value={profileForm.displayName}
                            type="text"
                            required
                            onInputChange={handleChange}
                        />
                    </InputField>
                    <InputField label="Bio">
                        <InputText
                            name="bio"
                            value={profileForm.bio || ""}
                            isMultipleLine={true}
                            onInputChange={handleChange}
                        />
                    </InputField>
                </Box>
            </form>
        </Box>
    );
};
export default ProfileDetail;
