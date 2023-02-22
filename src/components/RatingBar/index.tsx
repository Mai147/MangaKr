import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import RatingItem from "./RatingItem";

type RatingBarProps = {
    rate: number;
    setRate?: (value: number) => void;
    size?: string | number;
    maxRate?: number;
    readonly?: boolean;
};

const RatingBar: React.FC<RatingBarProps> = ({
    rate,
    setRate,
    size,
    maxRate = 5,
    readonly = false,
}) => {
    const listRange = Array.from(Array(maxRate).keys());
    const [hoverRate, setHoverRate] = useState(0);
    return (
        <Flex
            onMouseLeave={() => {
                if (readonly) return;
                setHoverRate(0);
            }}
        >
            {listRange.map((idx) => (
                <RatingItem
                    key={idx}
                    itemRate={idx + 1}
                    userRate={rate}
                    size={size}
                    readonly={readonly}
                    setUserRate={setRate}
                    hoverRate={hoverRate}
                    setHoverRate={setHoverRate}
                />
            ))}
        </Flex>
    );
};
export default RatingBar;
