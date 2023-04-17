import { Flex, Text } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import CommunityInfoApproveItem from "./CommunityInfoApproveItem";

type CommunityInfoApproveListProps = {
    list: any[];
    renderChild: (item: any) => ReactNode;
    handleApprove?: (item: any, isAccept: boolean) => Promise<void>;
    handleLock?: (item: any) => Promise<void>;
    type: "POST" | "TOPIC" | "VOTING";
    isAccept: boolean;
};

const CommunityInfoApproveList: React.FC<CommunityInfoApproveListProps> = ({
    list,
    type,
    renderChild,
    handleApprove,
    handleLock,
    isAccept,
}) => {
    return list && list.length > 0 ? (
        <>
            {list.map((item) => (
                <CommunityInfoApproveItem
                    key={item.id}
                    child={renderChild(item)}
                    handleApprove={async (isAccept) => {
                        handleApprove && (await handleApprove(item, isAccept));
                    }}
                    handleLock={async () => {
                        handleLock && (await handleLock(item));
                    }}
                    itemLockStatus={item.isLock}
                    isAccept={isAccept}
                />
            ))}
        </>
    ) : (
        <Flex align="center" justify="center" w="100%" py={10}>
            <Text>
                Không có{" "}
                {type === "POST"
                    ? "bài viết"
                    : type === "TOPIC"
                    ? "chủ đề"
                    : "cuộc bình chọn"}{" "}
                cần phê duyệt
            </Text>
        </Flex>
    );
};
export default CommunityInfoApproveList;
