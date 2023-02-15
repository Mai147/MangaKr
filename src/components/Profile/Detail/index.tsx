import { getAllUserRoute, getUserImageRoute } from "@/constants/firebaseRoutes";
import { auth, fireStore, storage } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import useSelectFile from "@/hooks/useSelectFile";
import { UserModel } from "@/models/User";
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
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { useUpdateProfile } from "react-firebase-hooks/auth";
import ProfileInputText from "../ProfileInputText";

type ProfileDetailProps = {
    user: UserModel;
};

export type ProfileFormState = {
    photoUrl?: string | null;
    email: string;
    displayName: string;
    subBio?: string;
    bio?: string;
};

const defaultProfileFormState: ProfileFormState = {
    photoUrl: null,
    email: "",
    displayName: "",
};

const ProfileDetail: React.FC<ProfileDetailProps> = ({ user }) => {
    const { updateUser } = useAuth();
    const { selectedFile, onSelectFile } = useSelectFile();
    const [updateProfile, updating, error] = useUpdateProfile(auth);
    const avatarRef = useRef<HTMLInputElement>(null);
    const [profileForm, setProfileForm] = useState<ProfileFormState>(
        defaultProfileFormState
    );
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setProfileForm({
            photoUrl: user.photoURL,
            displayName: user.displayName!,
            email: user.email!,
            subBio: user.subBio,
            bio: user.bio,
        });
    }, [user]);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
            let downloadUrl = profileForm.photoUrl;
            // Upload file
            if (selectedFile) {
                const imageRef = ref(storage, getUserImageRoute(user.uid));
                await uploadString(imageRef, selectedFile, "data_url");
                downloadUrl = await getDownloadURL(imageRef);
            }
            // Change user in db
            const success = await updateProfile({
                displayName: profileForm.displayName,
                photoURL: downloadUrl,
            });
            if (success) {
                const userDocRef = doc(fireStore, getAllUserRoute(), user.uid);
                await updateDoc(userDocRef, {
                    displayName: profileForm.displayName,
                    photoURL: downloadUrl,
                    subBio: profileForm.subBio,
                    bio: profileForm.bio,
                });
                // Update state
                updateUser({
                    ...profileForm,
                    photoUrl: downloadUrl,
                });
                setSuccess(true);
            }
        } catch (error) {
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
                        onClick={() => setSuccess(false)}
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
                                src={profileForm.photoUrl || ""}
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
                    <ProfileInputText
                        label="Email"
                        name="email"
                        value={profileForm.email}
                        type="email"
                        readonly={true}
                        onChange={handleChange}
                    />
                    <ProfileInputText
                        label="Tên hiển thị"
                        name="displayName"
                        value={profileForm.displayName}
                        type="text"
                        required
                        onChange={handleChange}
                    />
                    <ProfileInputText
                        label="Sub Bio"
                        name="subBio"
                        type="text"
                        value={profileForm.subBio || ""}
                        onChange={handleChange}
                    />
                    <ProfileInputText
                        label="Bio"
                        name="bio"
                        value={profileForm.bio || ""}
                        isMultipleLine={true}
                        onChange={handleChange}
                    />
                </Box>
            </form>
        </Box>
    );
};
export default ProfileDetail;
