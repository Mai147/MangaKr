import { Flex, Text } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import CommunityInfoApproveItem from "./CommunityInfoApproveItem";

type CommunityInfoApproveListProps = {
    list: any[];
    renderChild: (item: any) => ReactNode;
    handleApprove?: (item: any, isAccept: boolean) => Promise<void>;
    handleLock?: (item: any) => Promise<void>;
    handleDelete?: (item: any) => Promise<void>;
    type: "posts" | "topics" | "votings" | "users" | "books" | "reviews";
    isAccept: boolean;
    exception?: (item: any) => boolean;
};

const CommunityInfoApproveList: React.FC<CommunityInfoApproveListProps> = ({
    list,
    type,
    renderChild,
    handleApprove,
    handleLock,
    handleDelete,
    isAccept,
    exception,
}) => {
    return list && list.length > 0 ? (
        <>
            {list.map((item) =>
                exception && exception(item) ? (
                    <></>
                ) : (
                    <CommunityInfoApproveItem
                        key={item.id}
                        child={renderChild(item)}
                        handleApprove={
                            exception && exception(item)
                                ? undefined
                                : async (isAccept) => {
                                      handleApprove &&
                                          (await handleApprove(item, isAccept));
                                  }
                        }
                        handleLock={
                            exception
                                ? undefined
                                : handleLock
                                ? async () => {
                                      await handleLock(item);
                                  }
                                : undefined
                        }
                        handleDelete={
                            exception && exception(item)
                                ? undefined
                                : handleDelete
                                ? async () => {
                                      await handleDelete(item);
                                  }
                                : undefined
                        }
                        itemLockStatus={item.isLock}
                        isAccept={isAccept}
                    />
                )
            )}
        </>
    ) : (
        <Flex align="center" justify="center" w="100%" py={10}>
            <Text>
                Không có{" "}
                {type === "posts"
                    ? "bài viết"
                    : type === "topics"
                    ? "chủ đề"
                    : type === "votings"
                    ? "cuộc bình chọn"
                    : type === "users"
                    ? "thành viên"
                    : type === "books"
                    ? "Manga"
                    : "bài đánh giá"}{" "}
                cần phê duyệt
            </Text>
        </Flex>
    );
};
export default CommunityInfoApproveList;
