import NotAvailable from "@/components/Error/NotAvailable";
import ReviewForm from "@/components/Form/Review";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { routes } from "@/constants/routes";
import { fireStore } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import { Review } from "@/models/Review";
import { UserModel } from "@/models/User";
import { Box, Flex } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import Head from "next/head";
import React, { useEffect } from "react";

type editProps = {
    user: UserModel;
    review: Review;
};

const edit: React.FC<editProps> = ({ review, user }) => {
    const { authAction } = useAuth();
    useEffect(() => {
        authAction.setDefaultPath(routes.getHomePage());
        authAction.setNeedAuth(true);
    }, []);

    return (
        <>
            <Head>
                <title>MangaKr - Sửa bài đánh giá</title>
            </Head>
            <>
                {!review ? (
                    <NotAvailable title="Bài đánh giá này không tồn tại hoặc đã bị xóa!" />
                ) : (
                    <Flex
                        direction="column"
                        p={6}
                        bg="white"
                        borderRadius={4}
                        boxShadow="lg"
                        flexGrow={1}
                    >
                        <ReviewForm
                            user={user}
                            bookId={review.bookId}
                            review={review}
                        />
                    </Flex>
                )}
            </>
        </>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user, user_id } = cookies(context) || null;
    const { rid } = context.query;
    if (!token) {
        context.res.writeHead(302, { Location: routes.getHomePage() });
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
        ) as Review;
        if (review.creatorId !== user_id) {
            context.res.writeHead(302, { Location: routes.getHomePage() });
            context.res.end();
        }
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
