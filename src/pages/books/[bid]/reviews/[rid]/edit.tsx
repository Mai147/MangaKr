import NotAvailable from "@/components/Error/NotAvailable";
import ReviewForm from "@/components/Review/Form";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { HOME_PAGE } from "@/constants/routes";
import { fireStore } from "@/firebase/clientApp";
import { Review } from "@/models/Review";
import { UserModel } from "@/models/User";
import { Box } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React from "react";

type editProps = {
    user: UserModel;
    review: Review;
};

const edit: React.FC<editProps> = ({ review, user }) => {
    if (!review) {
        return (
            <NotAvailable title="Bài đánh giá này không tồn tại hoặc đã bị xóa!" />
        );
    }
    return (
        <Box p={6} boxShadow="lg">
            <ReviewForm user={user} bookId={review.bookId} review={review} />
        </Box>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user } = cookies(context) || null;
    const { rid } = context.query;
    if (!token) {
        context.res.writeHead(302, { Location: HOME_PAGE });
        context.res.end();
    }
    const us = JSON.parse(JSON.stringify(user));
    const reviewDocRef = doc(
        fireStore,
        firebaseRoute.getAllReviewRoute(),
        rid as string
    );
    const reviewDoc = await getDoc(reviewDocRef);
    if (reviewDoc.exists()) {
        const review = JSON.parse(
            JSON.stringify({
                id: reviewDoc.id,
                ...reviewDoc.data(),
            } as Review)
        );
        return {
            props: {
                user: us,
                review,
            },
        };
    } else {
        return {
            props: {
                user: us,
            },
        };
    }
}

export default edit;
