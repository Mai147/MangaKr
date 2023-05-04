import InputField from "@/components/Input/InputField";
import InputText from "@/components/Input/InputText";
import ErrorText from "@/components/Modal/Auth/ErrorText";
import { ValidationError } from "@/constants/validation";
import { auth } from "@/firebase/clientApp";
import { UserModel } from "@/models/User";
import { validateChangePassword } from "@/validation/authValidation";
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
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [firebaseError, setFirebaseError] = useState<Error>();
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        if (errors) setErrors([]);
        if (firebaseError) setFirebaseError(undefined);
        try {
            const res = validateChangePassword(
                profileForm.currentPassword,
                profileForm.newPassword,
                profileForm.confirmNewPassword
            );
            if (!res.result) {
                setErrors(res.errors);
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
        setLoading(false);
    };

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (errors) {
            const errorIdx = errors.findIndex(
                (e) => e.field === event.target.name
            );
            if (errorIdx > -1) {
                setErrors((prev) => prev.splice(errorIdx, 1));
            }
        }
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
                <Flex justify="space-between" align="center">
                    <Text fontWeight={500} fontSize={18}>
                        Đổi mật khẩu
                    </Text>
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
                    <InputField label="Mật khẩu cũ" required maxWidth={false}>
                        <Flex
                            direction="column"
                            flexGrow={1}
                            w="100%"
                            align="flex-start"
                        >
                            <InputText
                                name="currentPassword"
                                value={profileForm.currentPassword}
                                type="password"
                                required
                                onInputChange={handleChange}
                                isInvalid={
                                    !!errors.find(
                                        (error) =>
                                            error.field === "currentPassword"
                                    )
                                }
                            />
                            <ErrorText
                                error={
                                    errors.find(
                                        (error) =>
                                            error.field === "currentPassword"
                                    )?.message
                                }
                            />
                        </Flex>
                    </InputField>
                    <InputField label="Mật khẩu mới" required maxWidth={false}>
                        <Flex
                            direction="column"
                            flexGrow={1}
                            w="100%"
                            align="flex-start"
                        >
                            <InputText
                                name="newPassword"
                                value={profileForm.newPassword}
                                type="password"
                                required
                                onInputChange={handleChange}
                            />
                            <ErrorText
                                error={
                                    errors.find(
                                        (error) => error.field === "newPassword"
                                    )?.message
                                }
                            />
                        </Flex>
                    </InputField>
                    <InputField
                        label="Xác nhận mật khẩu mới"
                        required
                        maxWidth={false}
                    >
                        <Flex
                            direction="column"
                            flexGrow={1}
                            w="100%"
                            align="flex-start"
                        >
                            <InputText
                                name="confirmNewPassword"
                                value={profileForm.confirmNewPassword}
                                type="password"
                                required
                                onInputChange={handleChange}
                            />
                            <ErrorText
                                error={
                                    errors.find(
                                        (error) =>
                                            error.field === "confirmNewPassword"
                                    )?.message
                                }
                            />
                        </Flex>
                    </InputField>
                    <ErrorText userError={firebaseError} />
                </Box>
            </form>
        </Box>
    );
};
export default ProfilePassword;
