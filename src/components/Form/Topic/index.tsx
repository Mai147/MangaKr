import ImageUpload from "@/components/ImageUpload";
import TabItem from "@/components/Tab/TabItem";
import { CommunityRole } from "@/constants/roles";
import { routes } from "@/constants/routes";
import { toastOption } from "@/constants/toast";
import { ValidationError } from "@/constants/validation";
import useSelectFile from "@/hooks/useSelectFile";
import { Community } from "@/models/Community";
import { defaultTopicForm, Topic } from "@/models/Topic";
import { UserModel } from "@/models/User";
import TopicService from "@/services/TopicService";
import { validateCreateTopic } from "@/validation/topicValidation";
import { Divider, Flex, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IoDocument, IoImageOutline } from "react-icons/io5";
import FormFooter from "../Footer";
import FormHeader from "../Header";
import TopicFormContent from "./Content";

type TopicFormProps = {
    community: Community;
    user: UserModel;
    userRole?: CommunityRole;
};

const formTab = [
    {
        title: "Nội dung",
        icon: IoDocument,
    },
    {
        title: "Hình ảnh",
        icon: IoImageOutline,
    },
];

const TopicForm: React.FC<TopicFormProps> = ({ community, user, userRole }) => {
    const [topicForm, setTopicForm] = useState<Topic>({
        ...defaultTopicForm,
        creatorId: user.uid,
        creatorDisplayName: user.displayName!,
        creatorImageUrl: user.photoURL || undefined,
        communityId: community.id!,
    });
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [selectedTab, setSelectedTab] = useState(formTab[0].title);
    const { onSelectFile, selectedFile, setSelectedFile } = useSelectFile();
    const toast = useToast();

    const onSubmit = async () => {
        try {
            if (errors) setErrors([]);
            const res = validateCreateTopic(topicForm);
            if (!res.result) {
                setErrors(res.errors);
                toast({
                    ...toastOption,
                    title: "Nhập thiếu thông tin, vui lòng thử lại",
                    status: "error",
                });
                return;
            }
            await TopicService.create({ topicForm, community, userRole });
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
            <Flex direction="column" flexGrow={1}>
                <FormHeader
                    title={"Tạo chủ đề"}
                    backTitle={"Quay lại cộng đồng"}
                    backHref={routes.getCommunityDetailPage(community.id!)}
                />
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
                <Flex py={4} px={{ base: 0, md: 4 }} flexGrow={1}>
                    {selectedTab === formTab[0].title && (
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
                    {selectedTab === formTab[1].title && (
                        <ImageUpload
                            onSelectImage={onSelectFile}
                            setSelectedFile={setSelectedFile}
                            selectedFile={selectedFile}
                        />
                    )}
                </Flex>
                <FormFooter onSubmit={onSubmit} />
            </Flex>
        </Flex>
    );
};
export default TopicForm;
