import TabItem from "@/components/Tab/TabItem";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { ValidationError } from "@/constants/validation";
import { fireStore, storage } from "@/firebase/clientApp";
import useSelectFile from "@/hooks/useSelectFile";
import { Review } from "@/models/Review";
import { UserModel } from "@/models/User";
import { validateCreateReview } from "@/validation/reviewValidation";
import { Flex, Button, Divider, Text, useToast } from "@chakra-ui/react";
import {
    writeBatch,
    doc,
    collection,
    serverTimestamp,
    Timestamp,
    increment,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { IoImageOutline, IoDocument } from "react-icons/io5";
import { MdOutlineRateReview } from "react-icons/md";
import ReviewFormContent from "./Content";
import ImageUpload from "./ImageUpload";
import ReviewFormRate from "./Rate";

type ReviewFormProps = {
    bookId: string;
    review?: Review;
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
    bookName: "",
    content: "",
    creatorId: "",
    creatorDisplayName: "",
    numberOfComments: 0,
    numberOfDislikes: 0,
    numberOfLikes: 0,
    tagReview: "RECOMMENDED",
    title: "",
    rating: 0,
    createdAt: serverTimestamp() as Timestamp,
};

const ReviewForm: React.FC<ReviewFormProps> = ({ bookId, user, review }) => {
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
    const toast = useToast();

    useEffect(() => {
        if (review) {
            setReviewForm(review);
            if (review.imageUrl) {
                setSelectedFile(review.imageUrl);
            }
        }
    }, []);

    const handleChange = (field: string, value: any) => {
        setReviewForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const onSubmit = async () => {
        setLoading(true);
        if (review) {
            await onUpdate();
        } else {
            await onCreate();
        }
        setLoading(false);
    };

    const onCreate = async () => {
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
            const titleLowerCase = reviewForm.title.toLowerCase();
            batch.set(reviewDocRef, {
                ...reviewForm,
                titleLowerCase,
                createdAt: serverTimestamp() as Timestamp,
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
    };

    const onUpdate = async () => {
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
                fireStore,
                firebaseRoute.getAllReviewRoute(),
                review?.id!
            );
            let reviewImageUrl;
            if (
                reviewForm.imageUrl &&
                reviewForm.imageUrl !== review?.imageUrl
            ) {
                reviewImageUrl = await onUploadFile(
                    firebaseRoute.getReviewImageRoute(review?.id!)
                );
            } else if (!reviewForm.imageUrl && review?.imageUrl) {
                const imageRef = ref(
                    storage,
                    firebaseRoute.getReviewImageRoute(review.id!)
                );
                await deleteObject(imageRef);
            }
            const titleLowerCase = reviewForm.title.toLowerCase();
            batch.update(reviewDocRef, {
                ...reviewForm,
                titleLowerCase,
                createdAt: serverTimestamp() as Timestamp,
            });
            // Update image
            if (reviewForm.imageUrl !== review?.imageUrl) {
                batch.update(
                    doc(
                        fireStore,
                        firebaseRoute.getAllReviewRoute(),
                        review?.id!
                    ),
                    {
                        imageUrl: reviewImageUrl,
                    }
                );
            }
            await batch.commit();
            toast({
                title: "Sửa thành công!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
        } catch (error) {
            console.log(error);
        }
    };

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
export default ReviewForm;
