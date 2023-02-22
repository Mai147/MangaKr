import ReviewFormContent from "@/components/Review/Form/Content";
import ImageUpload from "@/components/Review/Form/ImageUpload";
import ReviewFormRate from "@/components/Review/Form/Rate";
import TabItem from "@/components/Tab/TabItem";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { HOME_PAGE } from "@/constants/routes";
import { ValidationError } from "@/constants/validation";
import { fireStore, storage } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import useSelectFile from "@/hooks/useSelectFile";
import { Review } from "@/models/Review";
import { UserModel } from "@/models/User";
import { validateCreateReview } from "@/validation/reviewValidation";
import { Button, Divider, Flex, Text, useToast } from "@chakra-ui/react";
import { collection, doc, increment, writeBatch } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect, useState } from "react";
import { IoDocument, IoImageOutline } from "react-icons/io5";
import { MdOutlineRateReview } from "react-icons/md";

type BookReviewCreatePageProps = {
    bookId: string;
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
    {
        title: "Đánh giá",
        icon: MdOutlineRateReview,
    },
];

const defaultReview: Review = {
    bookId: "",
    content: "",
    creatorId: "",
    creatorDisplayName: "",
    numberOfComments: 0,
    numberOfDislikes: 0,
    numberOfLikes: 0,
    tagReview: "RECOMMENDED",
    title: "",
    rating: 0,
};

const BookReviewCreatePage: React.FC<BookReviewCreatePageProps> = ({
    bookId,
    user,
}) => {
    const { selectedFile, setSelectedFile, onSelectFile, onUploadFile } =
        useSelectFile();
    const [selectedTab, setSelectedTab] = useState(formTab[0].title);
    const [reviewForm, setReviewForm] = useState<Review>({
        ...defaultReview,
        bookId,
        creatorId: user.uid,
        creatorDisplayName: user.displayName!,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const { setDefaultPath, setNeedAuth } = useAuth();
    const toast = useToast();

    const handleChange = (field: string, value: any) => {
        setReviewForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const onSubmit = async () => {
        setLoading(true);
        try {
            if (errors) setErrors([]);
            const res = validateCreateReview(reviewForm);
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
            const reviewDocRef = doc(
                collection(fireStore, firebaseRoute.getAllReviewRoute())
            );
            const bookDocRef = doc(
                collection(fireStore, firebaseRoute.getAllBookRoute()),
                bookId
            );
            const reviewImageUrl = await onUploadFile(
                firebaseRoute.getReviewImageRoute(reviewDocRef.id)
            );
            batch.set(reviewDocRef, {
                ...reviewForm,
            });
            batch.update(bookDocRef, {
                numberOfReviews: increment(1),
            });
            // Update image
            if (reviewImageUrl) {
                batch.update(
                    doc(
                        fireStore,
                        firebaseRoute.getAllReviewRoute(),
                        reviewDocRef.id
                    ),
                    {
                        imageUrl: reviewImageUrl,
                    }
                );
            }
            await batch.commit();
            setReviewForm({
                ...defaultReview,
                bookId,
                creatorId: user.uid,
                creatorDisplayName: user.displayName!,
            });
            setSelectedFile(undefined);
            toast({
                title: "Viết bài thành công!",
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

    useEffect(() => {
        setDefaultPath(HOME_PAGE), setNeedAuth(true);
    }, []);

    return (
        <Flex direction="column" bg="white" borderRadius={4} mt={2}>
            <Flex direction="column">
                <Flex>
                    <Text fontSize={24} fontWeight={600}>
                        Viết review
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
                    <ImageUpload
                        selectedFile={selectedFile}
                        onSelectImage={onSelectFile}
                        setSelectedFile={setSelectedFile}
                    />
                )}
                {selectedTab === formTab[1].title && (
                    <ReviewFormContent
                        title={reviewForm.title}
                        content={reviewForm.content}
                        setTitle={(value) => {
                            handleChange("title", value);
                        }}
                        setContent={(value) => {
                            handleChange("content", value);
                        }}
                        errors={errors}
                    />
                )}
                {selectedTab === formTab[2].title && (
                    <ReviewFormRate
                        rating={reviewForm.rating}
                        setRating={(value) => {
                            handleChange("rating", value);
                        }}
                        tagReview={reviewForm.tagReview}
                        setTagReview={(value) => {
                            handleChange("tagReview", value);
                        }}
                        errors={errors}
                    />
                )}
            </Flex>
        </Flex>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user } = cookies(context) || null;
    const { bid } = context.query;
    if (!token) {
        context.res.writeHead(302, { Location: HOME_PAGE });
        context.res.end();
    }
    const us = JSON.parse(JSON.stringify(user));

    return {
        props: {
            user: us,
            bookId: bid,
        },
    };
}

export default BookReviewCreatePage;
