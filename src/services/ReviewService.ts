import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore, storage } from "@/firebase/clientApp";
import { Review } from "@/models/Review";
import FileUtils from "@/utils/FileUtils";
import ReviewUtils from "@/utils/ReviewUtils";
import { triGram } from "@/utils/StringUtils";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    limit,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    where,
    writeBatch,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

class ReviewService {
    static getAll = async ({
        userId,
        bookId,
        reviewLimit,
        reviewOrders,
    }: {
        bookId?: string;
        userId?: string;
        reviewLimit?: number;
        reviewOrders?: {
            reviewOrderBy: string;
            reviewOrderDirection: "asc" | "desc";
        }[];
    }) => {
        const reviewDocsRef = collection(
            fireStore,
            firebaseRoute.getAllReviewRoute()
        );
        let reviewConstraints = [];
        if (userId) {
            reviewConstraints.push(where("creatorId", "==", userId));
        }
        if (bookId) {
            reviewConstraints.push(where("bookId", "==", bookId));
        }
        if (reviewOrders) {
            reviewOrders.forEach((reviewOrder) => {
                reviewConstraints.push(
                    orderBy(
                        reviewOrder.reviewOrderBy,
                        reviewOrder.reviewOrderDirection
                    )
                );
            });
        }
        if (reviewLimit) {
            reviewConstraints.push(limit(reviewLimit));
        }
        const reviewQuery = query(reviewDocsRef, ...reviewConstraints);
        const reviewDocs = await getDocs(reviewQuery);
        const reviews = ReviewUtils.fromDocs(reviewDocs.docs);
        return reviews;
    };

    static get = async ({
        reviewId,
        userId,
    }: {
        reviewId: string;
        userId?: string;
    }) => {
        try {
            const reviewDocRef = doc(
                fireStore,
                firebaseRoute.getAllReviewRoute(),
                reviewId
            );
            const reviewDoc = await getDoc(reviewDocRef);
            if (reviewDoc.exists()) {
                if (userId) {
                    const reviewCreator = reviewDoc.data().creatorId;
                    if (reviewCreator !== userId) {
                        throw Error("Not creator");
                    }
                }

                return {
                    review: reviewDoc.exists()
                        ? (JSON.parse(
                              JSON.stringify({
                                  id: reviewDoc.id,
                                  ...reviewDoc.data(),
                              })
                          ) as Review)
                        : null,
                };
            }
            return;
        } catch (error) {
            console.log(error);
        }
    };

    static create = async ({
        bookId,
        reviewForm,
    }: {
        reviewForm: Review;
        bookId: string;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            const reviewDocRef = doc(
                collection(fireStore, firebaseRoute.getAllReviewRoute())
            );
            const bookDocRef = doc(
                collection(fireStore, firebaseRoute.getAllBookRoute()),
                bookId
            );
            const res = await FileUtils.uploadFile({
                imageRoute: firebaseRoute.getReviewImageRoute(reviewDocRef.id),
                imageUrl: reviewForm.imageUrl,
            });
            const trigramTitle = triGram(reviewForm.title);
            batch.set(reviewDocRef, {
                ...reviewForm,
                trigramTitle: trigramTitle.obj,
                createdAt: serverTimestamp() as Timestamp,
            });
            batch.update(bookDocRef, {
                numberOfReviews: increment(1),
            });
            // Update image
            if (res) {
                batch.update(
                    doc(
                        fireStore,
                        firebaseRoute.getAllReviewRoute(),
                        reviewDocRef.id
                    ),
                    {
                        imageUrl: res.downloadUrl,
                        imageRef: res.downloadRef,
                    }
                );
            }
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };

    static update = async ({
        review,
        reviewForm,
    }: {
        reviewForm: Review;
        review: Review;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            const reviewDocRef = doc(
                fireStore,
                firebaseRoute.getAllReviewRoute(),
                review?.id!
            );
            let res;
            if (reviewForm.imageUrl !== review?.imageUrl) {
                if (review.imageUrl) {
                    res = await FileUtils.uploadFile({
                        imageRoute: firebaseRoute.getReviewImageRoute(
                            review?.id!
                        ),
                        imageUrl: reviewForm.imageUrl,
                    });
                }
                if (reviewForm.imageRef) {
                    await deleteObject(ref(storage, reviewForm.imageRef));
                }
            }
            const trigramTitle = triGram(reviewForm.title);
            batch.update(reviewDocRef, {
                ...reviewForm,
                trigramTitle: trigramTitle.obj,
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
                        imageUrl: res?.downloadUrl,
                        imageRef: res?.downloadRef,
                    }
                );
            }
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };

    static delete = async ({ review }: { review: Review }) => {
        try {
            const batch = writeBatch(fireStore);
            // Delete image
            if (review.imageRef) {
                await deleteObject(ref(storage, review.imageRef));
            }
            const reviewDocRef = doc(
                collection(fireStore, firebaseRoute.getAllReviewRoute()),
                review.id
            );
            const bookDocRef = doc(
                collection(fireStore, firebaseRoute.getAllBookRoute()),
                review.bookId
            );
            const bookDoc = await getDoc(bookDocRef);
            if (bookDoc.exists()) {
                batch.update(bookDocRef, {
                    numberOfReviews: increment(-1),
                });
            }
            batch.delete(reviewDocRef);
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };
}

export default ReviewService;
