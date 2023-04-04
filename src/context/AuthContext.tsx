import { ProfileFormState } from "@/components/Profile/Detail";
import { routes } from "@/constants/routes";
import { UserModel } from "@/models/User";
import UserService from "@/services/UserService";
import { User } from "firebase/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

type AuthState = {
    user?: UserModel | null;
    updateUser: (user: ProfileFormState) => void;
    login: (user: User) => Promise<void>;
    logout: () => Promise<void>;
    setNeedAuth: (value: boolean) => void;
    setDefaultPath: (value: string) => void;
};

const defaultAuthState: AuthState = {
    user: null,
    updateUser: () => null,
    login: async () => {},
    logout: async () => {},
    setNeedAuth: () => null,
    setDefaultPath: () => null,
};

export const AuthContext = createContext<AuthState>(defaultAuthState);

export const AuthProvider = ({ children }: any) => {
    const rounter = useRouter();
    const [user, setUser] = useState<UserModel | null>(null);
    const [needAuth, setNeedAuth] = useState(false);
    const [defaultPath, setDefaultPath] = useState(routes.getHomePage());

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            const user = JSON.parse(Cookies.get("user")!);
            setUser(user);
        }
    }, []);

    useEffect(() => {
        if (user) {
            Cookies.set("user", JSON.stringify(user));
        }
    }, [user]);

    const updateUser = (user: ProfileFormState) => {
        setUser(
            (prev) =>
                ({
                    ...prev,
                    displayName: user.displayName,
                    photoURL: user.photoUrl,
                    subBio: user.subBio,
                    bio: user.bio,
                } as UserModel)
        );
    };

    const getUserFromDb = async (user: User) => {
        try {
            const loggedUser = await UserService.get({ userId: user.uid });
            setUser(loggedUser);
            return loggedUser;
        } catch (error) {
            console.log(error);
        }
    };

    const login = async (us: User) => {
        if (us) {
            const user = await getUserFromDb(us);
            const token = await us.getIdToken();
            Cookies.set("token", token);
            Cookies.set("user_id", us.uid);
            Cookies.set("user", JSON.stringify(user));
        }
    };

    const logout = async () => {
        if (needAuth) {
            setNeedAuth(false);
            await rounter.push(defaultPath);
        }
        setUser(null);
        Cookies.remove("token");
        Cookies.remove("user_id");
        Cookies.remove("user");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                updateUser,
                login,
                logout,
                setNeedAuth,
                setDefaultPath,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
