import { PASSWORD_MIN_LENGTH } from "@/constants/validation";
import { Timestamp } from "firebase/firestore";

export const isEmail = (email: string) => {
    const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailReg.test(email);
};

export const isMinLength = (field: string, length: number) => {
    return field.length >= length;
};

export const isMaxLength = (field: string, length: number) => {
    return field.length <= length;
};

export const isPassword = (password: string) => {
    return password.length >= PASSWORD_MIN_LENGTH;
};

export const formatNumber = (num: number, digits: number = 1) => {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup
        .slice()
        .reverse()
        .find(function (item) {
            return num >= item.value;
        });
    return item
        ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
        : "0";
};

export const triGram = (txt: string) => {
    const obj: any = {};
    const map = [];
    const s1 = (txt || "").toLowerCase();
    const n = 3;
    for (let k = 0; k <= s1.length - n; k++) {
        const x = s1.substring(k, k + n);
        map.push(x);
        obj[x] = true;
    }
    return {
        obj,
        map,
    };
};

export const getFileExtensionFromBase64 = (url: string) => {
    return url.split("data:image/")[1].split(";base64")[0];
};

export const isToday = (timestampDate: Timestamp) => {
    const date = new Date(timestampDate.seconds * 1000);
    const today = new Date();
    return date.toDateString() === today.toDateString();
};

export const compareDate = (
    firstTimestampDate: Timestamp,
    secondTimestampDate: Timestamp
) => {
    const firstDate = new Date(firstTimestampDate.seconds * 1000);
    const secondDate = new Date(secondTimestampDate.seconds * 1000);
    return firstDate.toDateString() === secondDate.toDateString();
};
