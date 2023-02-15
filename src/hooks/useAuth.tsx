import { getAllUserRoute } from "@/constants/firebaseRoutes";
import { AuthContext, AuthProvider } from "@/context/AuthContext";
import { auth, fireStore } from "@/firebase/clientApp";
import { UserModel } from "@/models/User";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
    useAuthState,
    useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import cookie from "js-cookie";

const useAuth = () => {
    return useContext(AuthContext);
    // const [user, setUser] = useState<UserModel | null>();
    // const [loginWithEmailAndPassword, userCred, loading, userError] =
    //     useSignInWithEmailAndPassword(auth);

    // const getUserFromDb = async (user: User) => {
    //     try {
    //         const displayName = user.displayName || user.email?.split("@")[0];
    //         const userDocRef = doc(fireStore, getAllUserRoute(), user.uid);
    //         const userDoc = await getDoc(userDocRef);
    //         setUser({
    //             id: user.uid,
    //             ...(userDoc.data() as UserModel),
    //             displayName,
    //         } as UserModel);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // const handleLogin = async (email: string, password: string) => {
    //     const res = await loginWithEmailAndPassword(
    //         email,
    //         password
    //     );
    //     if (res) {
    //         getUserFromDb(res.user);
    //         cookie.set('user_id', res.user.uid);
    //         cookie.set('user', JSON.stringify(res.user));
    //     }
    // }

    // const handleSignOut = () => {

    // }

    // return {
    //     user,
    // };
};

export default useAuth;
