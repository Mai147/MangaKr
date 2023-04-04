import ImageUpload from "@/components/ImageUpload";
import TabItem from "@/components/Tab/TabItem";
import { routes } from "@/constants/routes";
import { toastOption } from "@/constants/toast";
import { ValidationError } from "@/constants/validation";
import useSelectFile from "@/hooks/useSelectFile";
import { Community } from "@/models/Community";
import { defaultTopicForm, Topic } from "@/models/Topic";
import { UserModel } from "@/models/User";
import TopicService from "@/services/TopicService";
import { validateCreateTopic } from "@/validation/topicValidation";
import { Button, Divider, Flex, Link, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IoDocument, IoImageOutline } from "react-icons/io5";
import TopicFormContent from "./TopicFormContent";

type TopicFormProps = {
    community: Community;
    user: UserModel;
};

const formTab = [
    {
        title: "Hình ảnh",
        icon: IoImageOutline,
    },
    {
        title: "Nội dung",
        icon: IoDocument,
    },
];

const TopicForm: React.FC<TopicFormProps> = ({ community, user }) => {
    const [topicForm, setTopicForm] = useState<Topic>({
        ...defaultTopicForm,
        creatorId: user.uid,
        creatorDisplayName: user.displayName!,
        creatorImageUrl: user.photoURL || undefined,
        communityId: community.id!,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [selectedTab, setSelectedTab] = useState(formTab[0].title);
    const { onSelectFile, selectedFile, setSelectedFile } = useSelectFile();
    const toast = useToast();

    const onSubmit = async () => {
        try {
            setLoading(true);
            if (errors) setErrors([]);
            const res = validateCreateTopic(topicForm);
            if (!res.result) {
                setErrors(res.errors);
                toast({
                    ...toastOption,
                    title: "Nhập thiếu thông tin, vui lòng thử lại",
                    status: "error",
                });
                setLoading(false);
                return;
            }
            await TopicService.create({ topicForm, community });
            setTopicForm({
                ...defaultTopicForm,
                creatorId: user.uid,
                creatorDisplayName: user.displayName!,
                creatorImageUrl: user.photoURL || undefined,
                communityId: community.id!,
            });
            setSelectedFile(undefined);
            toast({
                ...toastOption,
                title: "Đăng bài thành công!",
                status: "success",
            });
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleChange = (field: string, value: any) => {
        setTopicForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    useEffect(() => {
        setTopicForm((prev) => ({
            ...prev,
            imageUrl: selectedFile,
        }));
    }, [selectedFile]);

    return (
        <Flex
            direction="column"
            bg="white"
            borderRadius={4}
            mt={2}
            flexGrow={1}
        >
            <Flex direction="column">
                <Flex align="center">
                    <Text fontSize={24} fontWeight={600}>
                        Tạo chủ đề
                    </Text>
                    <Button
                        w={28}
                        ml={8}
                        isLoading={loading}
                        onClick={onSubmit}
                    >
                        Lưu
                    </Button>
                    <Link
                        ml={4}
                        href={routes.getCommunityDetailPage(community.id!)}
                        _hover={{ textDecoration: "none" }}
                    >
                        <Button variant="outline">Quay lại cộng đồng</Button>
                    </Link>
                </Flex>

                <Divider my={4} />
                <Flex width="100%">
                    {formTab.map((item) => (
                        <TabItem
                            key={item.title}
                            item={item}
                            selected={item.title === selectedTab}
                            setSelectedTab={setSelectedTab}
                        />
                    ))}
                </Flex>
            </Flex>
            <Flex p={4} flexGrow={1}>
                {selectedTab === formTab[0].title && (
                    <ImageUpload
                        onSelectImage={onSelectFile}
                        setSelectedFile={setSelectedFile}
                        selectedFile={selectedFile}
                    />
                )}
                {selectedTab === formTab[1].title && (
                    <TopicFormContent
                        title={topicForm.title}
                        description={topicForm.description || ""}
                        setTitle={(value) => {
                            handleChange("title", value);
                        }}
                        setDescription={(value) => {
                            handleChange("description", value);
                        }}
                        errors={errors}
                    />
                )}
            </Flex>
        </Flex>
    );
};
export default TopicForm;
