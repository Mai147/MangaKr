import Head from "next/head";
import { Inter } from "@next/font/google";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import Home from "@/components/Home";
import { HomeProvider } from "@/context/HomeContext";
import {
    collection,
    collectionGroup,
    deleteField,
    doc,
    getDoc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    startAfter,
    Timestamp,
    where,
    writeBatch,
} from "firebase/firestore";
import { fireStore, storage } from "@/firebase/clientApp";
import { Button } from "@chakra-ui/react";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { triGram } from "@/utils/StringUtils";
import { getBlob, ref } from "firebase/storage";

const inter = Inter({ subsets: ["latin"] });

type HomePageProps = {};

const HomePage: React.FC<HomePageProps> = () => {
    const { authAction, user } = useAuth();
    useEffect(() => {
        authAction.setNeedAuth(false);
    }, []);

    // const testFunction = async () => {
    //     try {
    //         const batch = writeBatch(fireStore);
    //         const postDocsRef = collectionGroup(fireStore, "posts");
    //         const postDocs = await getDocs(postDocsRef);
    //         postDocs.docs.forEach((doc) => {
    //             batch.update(doc.ref, {
    //                 isAccept: false,
    //             });
    //         });
    //         await batch.commit();
    //         console.log(1);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // const testFunction = async () => {
    //     const postDocsRef = collection(
    //         fireStore,
    //         firebaseRoute.getCommunityPostRoute("Mqd83dp0gYmH8dsF5EQA")
    //     );
    //     const postDocRef = doc(postDocsRef, "CJhOFtkOGYQL9FvdBGR9");
    //     const lastDoc = await getDoc(postDocRef);
    //     const postQuery = query(
    //         postDocsRef,
    //         orderBy("createdAt", "desc"),
    //         where("isAccept", "==", false),
    //         startAfter(lastDoc),
    //         limit(1)
    //     );
    //     const postDocs = await getDocs(postQuery);
    //     const posts = postDocs.docs.map((doc) => doc.data());
    //     console.log(posts);
    // };

    // const testFunction = async () => {
    //     try {
    //         const batch = writeBatch(fireStore);
    //         const docsRef = collection(
    //             fireStore,
    //             firebaseRoute.getAllGenreRoute()
    //         );
    //         const docs = await getDocs(docsRef);
    //         docs.docs.forEach((doc) => {
    //             batch.update(doc.ref, {
    //                 // createdAt: serverTimestamp() as Timestamp,
    //                 creatorId: "Gw6Fcbm7yWV5zcr5ORlJlwP1lQw1",
    //                 creatorDisplayName: "Username",
    //             });
    //         });
    //         await batch.commit();
    //         console.log(2);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // const testFunction = async () => {
    //     try {
    //         const batch = writeBatch(fireStore);
    //         const docsRef = collection(
    //             fireStore,
    //             firebaseRoute.getAllGenreRoute()
    //         );
    //         const docs = await getDocs(docsRef);
    //         docs.docs.forEach((doc) => {
    //             const { name } = doc.data();
    //             const trigramName = triGram(name);
    //             // const { title } = doc.data();
    //             // const trigramTitle = triGram(title);
    //             batch.update(doc.ref, {
    //                 trigramName: trigramName.obj,
    //                 nameLowerCase: deleteField(),
    //                 // trigramTitle: trigramTitle.obj,
    //                 // titleLowerCase: deleteField(),
    //             });
    //         });
    //         await batch.commit();
    //         console.log(1);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // const testFunction = async () => {
    //     if (user) {
    //         try {
    //             const batch = writeBatch(fireStore);
    //             const docRef = doc(
    //                 fireStore,
    //                 `/users/${user.uid}/messages`,
    //                 "abc3"
    //             );
    //             batch.set(docRef, {
    //                 latest: "Hi",
    //                 numberOfUnseens: 2,
    //                 displayName: "abc",
    //             });
    //             const messageDocRef = doc(
    //                 collection(
    //                     fireStore,
    //                     `/users/${user.uid}/messages/abc/listMessage`
    //                 )
    //             );
    //             // batch.set(messageDocRef, {
    //             //     text: "Hello",
    //             //     type: 0,
    //             // });
    //             await batch.commit();
    //             console.log(1);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    // };

    // const testFunction = async () => {
    //     try {
    //         const batch = writeBatch(fireStore);
    //         const firstDocsRef = collectionGroup(fireStore, "messageList");
    //         const firstDocs = await getDocs(firstDocsRef);
    //         firstDocs.forEach((doc) => {
    //             batch.delete(doc.ref);
    //         });
    //         const secondDocsRef = collectionGroup(fireStore, "messages");
    //         const secondDocs = await getDocs(secondDocsRef);
    //         secondDocs.forEach((doc) => {
    //             batch.delete(doc.ref);
    //         });
    //         await batch.commit();
    //         console.log(1);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const testFunction = async () => {
        try {
            const batch = writeBatch(fireStore);
            const docsRef = collectionGroup(fireStore, "users");
            const docs = await getDocs(docsRef);
            for (const doc of docs.docs) {
                const { displayName } = doc.data();
                const trigramName = triGram(displayName);
                batch.update(doc.ref, { trigramName: deleteField() });
                batch.update(doc.ref, { trigramName: trigramName.obj });
                // batch.update(doc.ref, {
                //     // id: doc.ref.id,
                //     numberOfFollows: 0,
                //     numberOfFolloweds: 0,
                // });
            }
            await batch.commit();
            console.log(1);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Button onClick={testFunction}>Test</Button>
                <HomeProvider>
                    <Home />
                </HomeProvider>
            </main>
        </>
    );
};

export default HomePage;
