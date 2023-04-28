import InputText from "@/components/Input/InputText";
import ErrorText from "@/components/Modal/Auth/ErrorText";
import { CommunityRole } from "@/constants/roles";
import { routes } from "@/constants/routes";
import { toastOption } from "@/constants/toast";
import { ValidationError } from "@/constants/validation";
import { Community } from "@/models/Community";
import { UserModel } from "@/models/User";
import { defaultVotingForm, defaultVotingOption, Voting } from "@/models/Vote";
import VotingService from "@/services/VotingService";
import { formatDateToDateTimeLocal } from "@/utils/StringUtils";
import { validateCreateVoting } from "@/validation/votingValidation";
import {
    Flex,
    Divider,
    Icon,
    VStack,
    Text,
    Button,
    useToast,
    Box,
    Input,
    HStack,
} from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import { IoAdd } from "react-icons/io5";
import { v4 } from "uuid";
import FormFooter from "../Footer";
import FormHeader from "../Header";
import VotingOptionItem from "./OptionItem";

type VotingFormProps = {
    community: Community;
    user: UserModel;
    userRole?: CommunityRole;
};

const VotingForm: React.FC<VotingFormProps> = ({
    community,
    user,
    userRole,
}) => {
    const [votingForm, setVotingForm] = useState<Voting>(defaultVotingForm);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const toast = useToast();

    const onAddOption = () => {
        const item = votingForm.options.find(
            (item) => !item.imageUrl && !item.value
        );
        if (item) {
            toast({
                ...toastOption,
                title: "Vui lòng điền thông tin của lựa chọn trên trước khi thêm lựa chọn mới",
                status: "error",
            });
        } else {
            setVotingForm((prev) => ({
                ...prev,
                options: [
                    ...prev.options,
                    { ...defaultVotingOption, id: v4() },
                ],
            }));
        }
    };

    const onSubmit = async () => {
        try {
            if (errors) setErrors([]);
            const res = validateCreateVoting(votingForm);
            if (!res.result) {
                setErrors(res.errors);
                toast({
                    ...toastOption,
                    title: "Nhập thiếu thông tin, vui lòng thử lại",
                    status: "error",
                });
                return;
            }
            await VotingService.create({
                votingForm: {
                    ...votingForm,
                    creatorId: user.uid,
                    creatorDisplayName: user.displayName!,
                    creatorImageUrl: user.photoURL || undefined,
                    communityId: community.id!,
                },
                community,
                userRole,
            });
            setVotingForm(defaultVotingForm);
            toast({
                ...toastOption,
                title: "Tạo bình chọn thành công thành công!",
                status: "success",
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Flex
            direction="column"
            bg="white"
            borderRadius={4}
            mt={2}
            flexGrow={1}
        >
            <Flex direction="column" flexGrow={1}>
                <Flex direction="column" flexGrow={1}>
                    <FormHeader
                        title="Tạo cuộc bình chọn"
                        backTitle="Quay lại cộng đồng"
                        backHref={routes.getCommunityDetailPage(community.id!)}
                    />

                    <Divider my={4} />
                    <Box>
                        <HStack spacing={12} align="flex-start">
                            <VStack flexGrow={1} align="flex-start">
                                <InputText
                                    onInputChange={(e) => {
                                        setVotingForm((prev) => ({
                                            ...prev,
                                            content: e.target.value,
                                        }));
                                        if (e.target.value) {
                                            setErrors((prev) =>
                                                prev.filter(
                                                    (item) =>
                                                        item.field !== "content"
                                                )
                                            );
                                        }
                                    }}
                                    placeholder="Nội dung bình chọn..."
                                    value={votingForm.content}
                                    required
                                />
                                <ErrorText
                                    error={
                                        errors.find(
                                            (error) => error.field === "content"
                                        )?.message
                                    }
                                />
                            </VStack>
                            <VStack align="flex-end">
                                <HStack flexShrink={0} spacing={4}>
                                    <Text>Thời gian:</Text>
                                    <Box w="300px">
                                        <Input
                                            type="datetime-local"
                                            value={formatDateToDateTimeLocal(
                                                votingForm.timeLast
                                            )}
                                            onChange={(e) => {
                                                const date = Timestamp.fromDate(
                                                    new Date(e.target.value)
                                                );
                                                setVotingForm((prev) => ({
                                                    ...prev,
                                                    timeLast: date,
                                                }));
                                                if (e.target.value) {
                                                    setErrors((prev) =>
                                                        prev.filter(
                                                            (item) =>
                                                                item.field !==
                                                                "timeLast"
                                                        )
                                                    );
                                                }
                                            }}
                                            borderColor="gray.400"
                                        />
                                    </Box>
                                </HStack>
                                <ErrorText
                                    error={
                                        errors.find(
                                            (error) =>
                                                error.field === "timeLast"
                                        )?.message
                                    }
                                />
                            </VStack>
                        </HStack>
                    </Box>
                    <VStack mt={4}>
                        <VStack w="100%" spacing={4}>
                            {votingForm.options.map((votingOption) => (
                                <VotingOptionItem
                                    key={votingOption.id}
                                    votingOption={votingOption}
                                    setVotingOption={(callback) => {
                                        setVotingForm((prev) => ({
                                            ...prev,
                                            options: prev.options.map((item) =>
                                                item.id !== votingOption.id
                                                    ? item
                                                    : callback(item)
                                            ),
                                        }));
                                        setErrors((prev) =>
                                            prev.filter(
                                                (item) =>
                                                    item.field !== "options"
                                            )
                                        );
                                    }}
                                    onDelete={() => {
                                        setVotingForm((prev) => ({
                                            ...prev,
                                            options: prev.options.filter(
                                                (item) =>
                                                    item.id !== votingOption.id
                                            ),
                                        }));
                                    }}
                                />
                            ))}
                        </VStack>
                        <Box alignSelf="flex-start">
                            <ErrorText
                                error={
                                    errors.find(
                                        (error) => error.field === "options"
                                    )?.message
                                }
                            />
                        </Box>
                        <Button mt={4} variant="outline" onClick={onAddOption}>
                            <Flex align="center">
                                <Text>Thêm lựa chọn</Text>
                                <Icon as={IoAdd} ml={1} fontSize={20} />
                            </Flex>
                        </Button>
                    </VStack>
                </Flex>
                <FormFooter onSubmit={onSubmit} />
            </Flex>
        </Flex>
    );
};
export default VotingForm;
