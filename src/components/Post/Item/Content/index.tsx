import { Post } from "@/models/Post";
import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

type PostItemContentProps = {
    post: Post;
    size?: "md" | "lg";
};

const PostItemContent: React.FC<PostItemContentProps> = ({
    post,
    size = "md",
}) => {
    const [contentLine, setContentLine] = useState<number | undefined>(3);
    const [showMore, setShowMore] = React.useState(false);

    const contentRef = useRef<HTMLDivElement>(null);

    const checkOverflow = () => {
        const el = contentRef.current;
        if (el) {
            const curOverflow = el.style.overflow;

            if (!curOverflow || curOverflow === "visible")
                el.style.overflow = "hidden";

            const isOverflowing =
                el.clientWidth < el.scrollWidth ||
                el.clientHeight < el.scrollHeight;

            el.style.overflow = curOverflow;

            setShowMore(isOverflowing);
        }
    };

    useEffect(() => {
        checkOverflow();
    }, [contentRef.current]);

    return (
        <Box px={size === "md" ? 4 : 8} pb={size === "md" ? 0 : 4}>
            <Text>{post.caption}</Text>
            <div
                dangerouslySetInnerHTML={{
                    __html: post.description || "",
                }}
                style={{
                    display: "-webkit-box",
                    WebkitLineClamp: contentLine,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}
                className="ck ck-content"
                ref={contentRef}
            ></div>
            {showMore && (
                <Text
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => setContentLine(contentLine ? undefined : 3)}
                >
                    {contentLine ? "Xem thêm" : "Thu gọn"}
                </Text>
            )}
        </Box>
    );
};
export default PostItemContent;
