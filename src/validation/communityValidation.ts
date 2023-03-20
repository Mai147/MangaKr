import {
    getIsExistsError,
    getMaxLengthError,
    getMinLengthError,
    getRequiredError,
} from "@/constants/errors";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { ValidationError, ValidationResult } from "@/constants/validation";
import { fireStore } from "@/firebase/clientApp";
import { Community } from "@/models/Community";
import { isMaxLength, isMinLength } from "@/utils/StringUtils";
import { collection, getDocs, query, where } from "firebase/firestore";

export const validateCreateCommunity = async (
    community: Community,
    currentCommunityName?: string
): Promise<ValidationResult> => {
    let res: ValidationResult = {
        errors: [],
        result: false,
    };
    if (!community.name) {
        const error: ValidationError = {
            field: "name",
            message: getRequiredError("tên cộng đồng"),
        };
        res.errors.push(error);
    } else if (!isMinLength(community.name, 3)) {
        const error: ValidationError = {
            field: "name",
            message: getMinLengthError("tên cộng đồng", 3),
        };
        res.errors.push(error);
    } else if (!isMaxLength(community.name, 36)) {
        const error: ValidationError = {
            field: "name",
            message: getMaxLengthError("tên cộng đồng", 36),
        };
        res.errors.push(error);
    } else if (community.name !== currentCommunityName) {
        const communityQuery = query(
            collection(fireStore, firebaseRoute.getAllCommunityRoute()),
            where("name", "==", community.name)
        );
        const communityDocs = await getDocs(communityQuery);
        if (communityDocs.docs.length > 0) {
            const error: ValidationError = {
                field: "name",
                message: getIsExistsError("Tên cộng đồng"),
            };
            res.errors.push(error);
        }
    }
    if (!community.bookId) {
        const error: ValidationError = {
            field: "bookId",
            message: getRequiredError("Manga"),
        };
        res.errors.push(error);
    }
    if (!community.privacyType) {
        const error: ValidationError = {
            field: "privacyTyoe",
            message: getRequiredError("chế độ"),
        };
        res.errors.push(error);
    }
    if (res.errors.length <= 0) {
        res.result = true;
    }
    return res;
};
