import NotAvailable from "@/components/Error/NotAvailable";
import PageContent from "@/components/Layout/PageContent";
import RightSidebar from "@/components/Layout/Sidebar/RightSidebar";
import ReviewDetail from "@/components/Review/Detail";
import { Review } from "@/models/Review";
import ReviewService from "@/services/ReviewService";
import { GetServerSidePropsContext } from "next";
import React from "react";

type ReviewDetailPageProps = {
    review?: Review;
};

const ReviewDetailPage: React.FC<ReviewDetailPageProps> = ({ review }) => {
    if (!review) {
        return (
            <NotAvailable title="Bài đánh giá này đã bị khóa hoặc không tồn tại!" />
        );
    }
    return (
        <PageContent>
            <ReviewDetail review={review} />
            <RightSidebar />
        </PageContent>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { rid } = context.query;
    const res = await ReviewService.get({ reviewId: rid as string });
    return {
        props: {
            review: res?.review || null,
        },
    };
}

export default ReviewDetailPage;
