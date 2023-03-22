import ImageMultipleUpload from "@/components/ImageUpload/ImageMultipleUpload";
import TabItem from "@/components/Tab/TabItem";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { ValidationError } from "@/constants/validation";
import { fireStore } from "@/firebase/clientApp";
import useSelectFile from "@/hooks/useSelectFile";
import { defaultPostForm, Post } from "@/models/Post";
import { UserModel } from "@/models/User";
import { validateCreatePost } from "@/validation/postValidation";
import { Flex, Button, Divider, Text, useToast } from "@chakra-ui/react";
import {
    collection,
    doc,
    increment,
    serverTimestamp,
    Timestamp,
    writeBatch,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { IoImageOutline, IoDocument } from "react-icons/io5";
import PostFormContent from "./Content";

type PostFormProps = {
    communityId?: string;
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

const PostForm: React.FC<PostFormProps> = ({ communityId, user }) => {
    const [postForm, setPostForm] = useState<Post>({
        ...defaultPostForm,
        creatorId: user.uid,
        creatorDisplayName: user.displayName!,
        creatorImageUrl: user.photoURL,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [selectedTab, setSelectedTab] = useState(formTab[0].title);
    const {
        onSelectMultipleFile,
        selectedListFile,
        setSelectedListFile,
        onUploadMultipleFile,
    } = useSelectFile();
    const toast = useToast();

    useEffect(() => {
        setPostForm((prev) => ({
            ...prev,
            imageUrls: selectedListFile,
        }));
    }, [selectedListFile]);

    const onSubmit = async () => {
        try {
            setLoading(true);
            if (errors) setErrors([]);
            const res = validateCreatePost(postForm);
            if (!res.result) {
                setErrors(res.errors);
                toast({
                    title: "Nhập thiếu thông tin, vui lòng thử lại",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right",
                });
                setLoading(false);
                return;
            }
            const batch = writeBatch(fireStore);
            let postDocRef;
            if (communityId) {
                postDocRef = doc(
                    collection(
                        fireStore,
                        firebaseRoute.getCommunityPostRoute(communityId)
                    )
                );
                const communityDocRef = doc(
                    fireStore,
                    firebaseRoute.getAllCommunityRoute(),
                    communityId
                );
                batch.update(communityDocRef, {
                    numberOfPosts: increment(1),
                });
            } else {
                postDocRef = doc(
                    collection(fireStore, firebaseRoute.getAllPostRoute())
                );
            }
            const postImageUrls = await onUploadMultipleFile(
                firebaseRoute.getPostImageRoute(postDocRef.id)
            );
            const captionLowerCase = postForm.caption.toLowerCase();
            batch.set(postDocRef, {
                ...postForm,
                communityId,
                captionLowerCase,
                createdAt: serverTimestamp() as Timestamp,
            });
            if (postImageUrls) {
                batch.update(postDocRef, {
                    imageUrls: postImageUrls,
                });
            }
            await batch.commit();
            setPostForm({
                ...defaultPostForm,
                creatorId: user.uid,
                creatorDisplayName: user.displayName!,
                creatorImageUrl: user.photoURL,
            });
            setSelectedListFile([]);
            toast({
                title: "Đăng bài thành công!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleChange = (field: string, value: any) => {
        setPostForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    return (
        <Flex direction="column" bg="white" borderRadius={4} mt={2}>
            <Flex direction="column">
                <Flex>
                    <Text fontSize={24} fontWeight={600}>
                        Tạo bài viết
                    </Text>
                    <Button
                        w={28}
                        ml={8}
                        isLoading={loading}
                        onClick={onSubmit}
                    >
                        Lưu
                    </Button>
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
            <Flex p={4}>
                {selectedTab === formTab[0].title && (
                    <ImageMultipleUpload
                        onSelectMultipleFile={onSelectMultipleFile}
                        setSelectedListFile={setSelectedListFile}
                        selectedListFile={selectedListFile}
                    />
                )}
                {selectedTab === formTab[1].title && (
                    <PostFormContent
                        caption={postForm.caption}
                        description={postForm.description || ""}
                        setCaption={(value) => {
                            handleChange("caption", value);
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
export default PostForm;
