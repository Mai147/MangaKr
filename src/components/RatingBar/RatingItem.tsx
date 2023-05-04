import { Icon } from "@chakra-ui/react";
import React from "react";
import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";

type RatingItemProps = {
    userRate: number;
    hoverRate?: number;
    setHoverRate?: (value: number) => void;
    setUserRate?: (value: number) => void;
    itemRate: number;
    size?: string | number;
    readonly?: boolean;
};

const RatingItem: React.FC<RatingItemProps> = ({
    itemRate,
    userRate,
    hoverRate = 0,
    setUserRate,
    setHoverRate,
    size,
    readonly = false,
}) => {
    return (
        <Icon
            as={
                itemRate <= hoverRate
                    ? IoStar
                    : itemRate <= userRate
                    ? IoStar
                    : itemRate <= userRate + 0.5
                    ? IoStarHalf
                    : IoStarOutline
            }
            color={
                itemRate <= hoverRate
                    ? "yellow.500"
                    : itemRate > userRate + 0.5
                    ? "gray.300"
                    : "yellow.300"
            }
            fontSize={{ base: 14, sm: size || 20, md: 16, xl: size || 20 }}
            cursor={readonly ? "default" : "pointer"}
            onMouseOver={() => {
                if (readonly) return;
                setHoverRate && setHoverRate(itemRate);
            }}
            onClick={() => {
                if (readonly) return;
                setUserRate && setUserRate(itemRate);
            }}
        />
    );
};
export default RatingItem;
