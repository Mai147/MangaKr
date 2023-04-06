import React, { useEffect } from "react";

type InfiniteScrollProps = {
    children: any;
    page: number;
    totalPage: number;
    onNext?: () => void;
    isLoading: boolean;
};

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
    isLoading,
    page,
    totalPage,
    onNext,
    children,
}) => {
    const onScroll = () => {
        if (!isLoading) {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;

            if (page < totalPage) {
                if (scrollTop + clientHeight >= scrollHeight - 10) {
                    onNext && onNext();
                }
            }
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [isLoading]);
    return <>{children}</>;
};
export default InfiniteScroll;
