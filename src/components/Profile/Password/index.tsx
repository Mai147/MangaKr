import ErrorText from "@/components/Modal/Auth/ErrorText";
import { auth } from "@/firebase/clientApp";
import { UserModel } from "@/models/User";
import { changePasswordValidation } from "@/validation/authValidation";
import {
    Flex,
    VStack,
    Button,
    Divider,
    Box,
    Text,
    Alert,
    AlertIcon,
    AlertDescription,
    AlertTitle,
    CloseButton,
} from "@chakra-ui/react";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import React, { useState } from "react";
import { useUpdatePassword } from "react-firebase-hooks/auth";
import ProfileInputText from "../ProfileInputText";

type ProfileFormState = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
};

const defaultProfileFormState: ProfileFormState = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
};

type ProfilePasswordProps = {
    user: UserModel;
};

const ProfilePassword: React.FC<ProfilePasswordProps> = ({ user }) => {
    const [updatePassword, updating, userError] = useUpdatePassword(auth);
    const [profileForm, setProfileForm] = useState<ProfileFormState>(
        defaultProfileFormState
    );
    const [error, setError] = useState("");
    const [firebaseError, setFirebaseError] = useState<Error>();
    const [success, setSuccess] = useState(false);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (error) setError("");
        if (firebaseError) setFirebaseError(undefined);
        try {
            const res = changePasswordValidation(
                profileForm.currentPassword,
                profileForm.newPassword,
                profileForm.confirmNewPassword
            );
            if (!res.result) {
                setError(res.message!);
            } else {
                const user = auth.currentUser;
                if (user) {
                    const cred = EmailAuthProvider.credential(
                        user.email!,
                        profileForm.currentPassword
                    );
                    const res = await reauthenticateWithCredential(user, cred);
                    if (res) {
                        const success = await updatePassword(
                            profileForm.newPassword
                        );
                        if (success) {
                            setProfileForm(defaultProfileFormState);
                            setSuccess(true);
                        } else {
                            setFirebaseError(userError);
                        }
                    }
                }
            }
        } catch (error: any) {
            console.log(error);
            setFirebaseError(error);
        }
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
                                Mật khẩu của bạn đã được thay đổi
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
                            Đổi mật khẩu
                        </Text>
                    </VStack>
                    <Button
                        width={{ base: 20, md: 28 }}
                        size={{ base: "sm", sm: "md" }}
                        type="submit"
                        isLoading={updating}
                    >
                        Lưu
                    </Button>
                </Flex>
                <Divider my={4} />
                <Box>
                    <ProfileInputText
                        label="Mật khẩu cũ"
                        name="currentPassword"
                        value={profileForm.currentPassword}
                        type="password"
                        required
                        onChange={handleChange}
                    />
                    <ProfileInputText
                        label="Mật khẩu mới"
                        name="newPassword"
                        value={profileForm.newPassword}
                        type="password"
                        required
                        onChange={handleChange}
                    />
                    <ProfileInputText
                        label="Xác nhận mật khẩu mới"
                        name="confirmNewPassword"
                        value={profileForm.confirmNewPassword}
                        type="password"
                        required
                        onChange={handleChange}
                    />
                    <ErrorText error={error} userError={firebaseError} />
                </Box>
            </form>
        </Box>
    );
};
export default ProfilePassword;
