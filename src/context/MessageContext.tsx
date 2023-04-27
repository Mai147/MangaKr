import { firebaseRoute } from "@/constants/firebaseRoutes";
import { MESSAGE_PAGE_COUNT, SEARCH_PAGE_COUNT } from "@/constants/pagination";
import { routes } from "@/constants/routes";
import { fireStore } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import useDebounce from "@/hooks/useDebounce";
import useSelectFile from "@/hooks/useSelectFile";
import usePagination, {
    defaultPaginationInput,
    defaultPaginationOutput,
    MessagePaginationInput,
    PaginationOutput,
    UserPaginationInput,
} from "@/hooks/usePagination";
import { Message } from "@/models/Message";
import { UserMessageSnippet, UserModel, UserSnippet } from "@/models/User";
import MessageService from "@/services/MessageService";
import UserService from "@/services/UserService";
import { isToday } from "@/utils/StringUtils";
import UserUtils from "@/utils/UserUtils";
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { ChangeEvent, createContext, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

type MessageState = {
    listUsers: UserMessageSnippet[];
    selectedUser?: UserSnippet;
    searchUser: {
        input: UserPaginationInput;
        output: PaginationOutput;
    };
    selectedUserMessage: {
        input: MessagePaginationInput;
        output: PaginationOutput;
    };
    isSearching: boolean;
    messageInput: {
        content: string;
        imageUrls: string[];
    };
    isNewMessage: boolean;
    loading: {
        getListUserLoading: boolean;
        getListMessageLoading: boolean;
        sendMessageLoading: boolean;
    };
};

type MessageAction = {
    search: (searchValue: string) => void;
    openSearch: () => void;
    closeSearch: () => void;
    switchUser: (user: UserSnippet) => void;
    onTypeMessageText: (value: string) => void;
    onChooseImages: (event: ChangeEvent<HTMLInputElement>) => void;
    onPasteImage: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
    onDeleteImageInput: (url: string) => void;
    handleSendMessage: () => Promise<void>;
    loadMoreMessage: () => void;
};

type MessageContextState = {
    messageState: MessageState;
    messageAction: MessageAction;
};

const defaultMessageState: MessageState = {
    listUsers: [],
    searchUser: {
        input: {
            ...defaultPaginationInput,
            pageCount: SEARCH_PAGE_COUNT,
        },
        output: defaultPaginationOutput,
    },
    selectedUserMessage: {
        input: {
            ...defaultPaginationInput,
            pageCount: MESSAGE_PAGE_COUNT,
            userId: "",
            receiverId: "",
        },
        output: defaultPaginationOutput,
    },
    messageInput: {
        content: "",
        imageUrls: [],
    },
    isNewMessage: false,
    isSearching: false,
    loading: {
        getListUserLoading: false,
        getListMessageLoading: false,
        sendMessageLoading: false,
    },
};

const defaultMessageAction: MessageAction = {
    search: () => {},
    openSearch: () => {},
    closeSearch: () => {},
    switchUser: () => {},
    onTypeMessageText: () => {},
    onChooseImages: () => {},
    onPasteImage: () => {},
    onDeleteImageInput: () => {},
    handleSendMessage: async () => {},
    loadMoreMessage: () => {},
};

const defaultMessageContextState: MessageContextState = {
    messageState: defaultMessageState,
    messageAction: defaultMessageAction,
};

export const MessageContext = createContext<MessageContextState>(
    defaultMessageContextState
);

export const MessageProvider = ({ children }: any) => {
    const { user } = useAuth();
    const router = useRouter();
    const [messageState, setMessageState] =
        useState<MessageState>(defaultMessageState);
    const debouncedSearch = useDebounce(
        messageState.searchUser.input.searchValue || "",
        300
    );
    const {
        onSelectMultipleFile,
        selectedListFile,
        onPasteFile,
        setSelectedListFile,
    } = useSelectFile();
    const { getUsers, getMessages } = usePagination();
    const isFirst = useRef(true);
    const isFirstLatestMessage = useRef(true);

    const getListSearchUsers = async () => {
        setMessageState((prev) => ({
            ...prev,
            loading: {
                ...prev.loading,
                getListUserLoading: true,
            },
        }));
        const input: UserPaginationInput = {
            ...messageState.searchUser.input,
            setDocValue: (docValue) => {
                setMessageState((prev) => ({
                    ...prev,
                    searchUser: {
                        ...prev.searchUser,
                        input: {
                            ...prev.searchUser.input,
                            docValue,
                        },
                    },
                }));
            },
        };
        const res = await getUsers(input);
        if (res) {
            setMessageState((prev) => ({
                ...prev,
                searchUser: {
                    ...prev.searchUser,
                    input: {
                        ...prev.searchUser.input,
                        isFirst: false,
                    },
                    output: res,
                },
            }));
        }
        setMessageState((prev) => ({
            ...prev,
            loading: {
                ...prev.loading,
                getListUserLoading: false,
            },
        }));
    };

    const getListMessages = async () => {
        if (
            messageState.selectedUserMessage.input.userId &&
            messageState.selectedUserMessage.input.receiverId
        ) {
            setMessageState((prev) => ({
                ...prev,
                loading: {
                    ...prev.loading,
                    getListMessageLoading: true,
                },
            }));
            const input: MessagePaginationInput = {
                ...messageState.selectedUserMessage.input,
                setDocValue: (docValue) => {
                    setMessageState((prev) => ({
                        ...prev,
                        selectedUserMessage: {
                            ...prev.selectedUserMessage,
                            input: {
                                ...prev.selectedUserMessage.input,
                                docValue,
                            },
                        },
                    }));
                },
            };
            const res = await getMessages(input);
            if (res) {
                setMessageState((prev) => ({
                    ...prev,
                    selectedUserMessage: {
                        ...prev.selectedUserMessage,
                        output: {
                            page: res.page,
                            totalPage: res.totalPage,
                            list: [
                                ...res.list.reverse(),
                                ...prev.selectedUserMessage.output.list,
                            ],
                        },
                        input: {
                            ...prev.selectedUserMessage.input,
                            isFirst: false,
                        },
                    },
                }));
            }
            setMessageState((prev) => ({
                ...prev,
                loading: {
                    ...prev.loading,
                    getListMessageLoading: false,
                },
            }));
        }
    };

    const getLatestMessages = async (
        userId: string,
        receiverId: string,
        messageId: string
    ) => {
        if (!isFirstLatestMessage.current) {
            const message = await MessageService.get({
                messageId,
                receiverId,
                userId,
            });
            if (message) {
                if (
                    !messageState.selectedUserMessage.output.list.find(
                        (item: Message) => item.id === message.id
                    )
                ) {
                    setMessageState((prev) => ({
                        ...prev,
                        selectedUserMessage: {
                            ...prev.selectedUserMessage,
                            input: {
                                ...prev.selectedUserMessage.input,
                                exceptionCount:
                                    (prev.selectedUserMessage.input
                                        .exceptionCount || 0) + 1,
                            },
                        },
                    }));
                }
                setMessageState((prev) => ({
                    ...prev,
                    selectedUserMessage: {
                        ...prev.selectedUserMessage,
                        output: {
                            ...prev.selectedUserMessage.output,
                            list: [
                                ...prev.selectedUserMessage.output.list.filter(
                                    (item: Message) => item.id !== message.id
                                ),
                                message,
                            ],
                        },
                    },
                    isNewMessage: true,
                }));
            }
        } else {
            isFirstLatestMessage.current = false;
        }
    };

    const loadMoreMessage = () => {
        setMessageState((prev) => ({
            ...prev,
            selectedUserMessage: {
                ...prev.selectedUserMessage,
                input: {
                    ...prev.selectedUserMessage.input,
                    page: prev.selectedUserMessage.input.page + 1,
                    isNext: true,
                },
            },
        }));
    };

    const search = (searchValue: string) => {
        setMessageState((prev) => ({
            ...prev,
            selectedUserMessage: {
                ...prev.selectedUserMessage,
                input: {
                    ...prev.selectedUserMessage.input,
                    searchValue,
                },
            },
            isSearching: true,
        }));
    };

    const openSearch = () => {
        setMessageState((prev) => ({
            ...prev,
            selectedUserMessage: {
                ...prev.selectedUserMessage,
                input: {
                    ...prev.selectedUserMessage.input,
                    searchValue: "",
                },
            },
            isSearching: true,
        }));
    };

    const closeSearch = () => {
        setMessageState((prev) => ({
            ...prev,
            selectedUserMessage: {
                ...prev.selectedUserMessage,
                input: {
                    ...prev.selectedUserMessage.input,
                    searchValue: "",
                },
            },
            isSearching: false,
        }));
    };

    const switchUser = (user: UserSnippet) => {
        setMessageState((prev) => ({
            ...prev,
            isSearching: false,
            // selectedUser: user,
        }));
        router.push(`${routes.getMessageDetailPage(user.id)}`);
    };

    const onTypeMessageText = (value: string) => {
        setMessageState((prev) => ({
            ...prev,
            messageInput: {
                ...prev.messageInput,
                content: value,
            },
        }));
    };

    const onDeleteImageInput = (url: string) => {
        setSelectedListFile((prev) => prev.filter((image) => image !== url));
    };

    const handleSendMessage = async () => {
        try {
            if (
                !messageState.messageInput.content &&
                messageState.messageInput.imageUrls.length <= 0
            ) {
                return;
            }
            setMessageState((prev) => ({
                ...prev,
                loading: {
                    ...prev.loading,
                    sendMessageLoading: true,
                },
            }));
            if (!user || !messageState.selectedUser) {
                return;
            }
            const latestContentId = v4();
            const { selectedUser, messageInput } = messageState;
            const messageForm: Message = {
                id: v4(),
                latestContent: messageInput.content,
                imageUrls: messageInput.imageUrls,
                imageRefs: [],
                type: "SEND",
                latestContentId,
            };
            const lastItem =
                messageState.selectedUserMessage.output.list.slice(-1)[0];
            const isSameFromLatest =
                lastItem &&
                lastItem.type === "SEND" &&
                lastItem.imageUrls.length <= 0 &&
                messageForm.imageUrls.length <= 0 &&
                isToday(lastItem.createdAt as Timestamp);
            setMessageState((prev) => {
                const mess: Message = {
                    ...messageForm,
                    contents: [
                        {
                            id: latestContentId,
                            content: messageForm.latestContent!,
                            isSent: false,
                        },
                    ],
                    createdAt: Timestamp.fromDate(new Date()),
                };
                const list: Message[] =
                    prev.selectedUserMessage.output.list.map(
                        (item: Message, idx: number) => {
                            if (
                                idx !==
                                prev.selectedUserMessage.output.list.length - 1
                            ) {
                                return item;
                            } else {
                                const newItem: Message = {
                                    ...item,
                                    contents: [
                                        ...(item.contents || []),
                                        {
                                            id: latestContentId,
                                            content:
                                                messageForm.latestContent || "",
                                            isSent: false,
                                        },
                                    ],
                                    latestContent: messageForm.latestContent,
                                    createdAt: Timestamp.fromDate(new Date()),
                                };
                                return newItem;
                            }
                        }
                    );
                return {
                    ...prev,
                    selectedUserMessage: {
                        ...prev.selectedUserMessage,
                        output: {
                            ...prev.selectedUserMessage.output,
                            list: isSameFromLatest
                                ? list
                                : [
                                      ...prev.selectedUserMessage.output.list,
                                      mess,
                                  ],
                        },
                    },
                    messageInput: {
                        content: "",
                        imageUrls: [],
                    },
                    isNewMessage: true,
                };
            });
            setSelectedListFile([]);
            const res = await MessageService.create({
                senderId: user.uid,
                senderDisplayName: user.displayName!,
                senderImageUrl: user.photoURL,
                receiverId: selectedUser.id,
                receiverDisplayName: selectedUser.displayName,
                receiverImageUrl: selectedUser.imageUrl,
                messageForm: {
                    latestContentId,
                    latestContent: messageInput.content,
                    imageUrls: messageInput.imageUrls,
                    imageRefs: [],
                    type: "SEND",
                },
            });
            setMessageState((prev) => ({
                ...prev,
                loading: {
                    ...prev.loading,
                    sendMessageLoading: false,
                },
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const getUser = async (userId: string) => {
        const user = await UserService.get({ userId });
        if (user) {
            setMessageState((prev) => ({
                ...prev,
                selectedUser: UserUtils.toUserSnippet(user),
            }));
        }
    };

    useEffect(() => {
        const { uid } = router.query;
        if (uid) {
            getUser(uid as string);
        }
    }, [router.query]);

    useEffect(() => {
        if (messageState.listUsers[0] && !messageState.selectedUser) {
            switchUser(messageState.listUsers[0]);
            // setMessageState((prev) => ({
            //     ...prev,
            //     selectedUser: messageState.listUsers[0],
            // }));
        }
    }, [messageState.listUsers]);

    useEffect(() => {
        if (user) {
            const q = query(
                collection(
                    fireStore,
                    firebaseRoute.getUserMessageRoute(user.uid)
                ),
                orderBy("latestCreatedAt", "desc")
            );
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const userMessageSnippets = querySnapshot.docs.map((doc) => {
                    return {
                        id: doc.id,
                        ...doc.data(),
                    } as UserMessageSnippet;
                });
                setMessageState((prev) => ({
                    ...prev,
                    listUsers: userMessageSnippets,
                }));
            });
            return unsubscribe;
        }
    }, [user]);

    useEffect(() => {
        if (messageState.selectedUser) {
            setMessageState((prev) => ({
                ...prev,
                selectedUserMessage: {
                    input: {
                        ...defaultPaginationInput,
                        pageCount: MESSAGE_PAGE_COUNT,
                        userId: "",
                        receiverId: "",
                    },
                    output: defaultPaginationOutput,
                },
                isNewMessage: true,
            }));
        }
    }, [messageState.selectedUser]);

    useEffect(() => {
        if (user && messageState.selectedUser) {
            isFirst.current = true;
            isFirstLatestMessage.current = true;
            const { selectedUser } = messageState;
            const q = doc(
                fireStore,
                firebaseRoute.getUserMessageRoute(user.uid),
                selectedUser.id
            );
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const userMessage = snapshot.data() as UserMessageSnippet;
                MessageService.seen({
                    userId: user.uid,
                    receiverId: selectedUser.id,
                });
                if (userMessage) {
                    if (userMessage.type === "RECEIVE") {
                        getLatestMessages(
                            user.uid,
                            selectedUser.id,
                            userMessage.messageId
                        );
                    } else {
                        setMessageState((prev) => {
                            return {
                                ...prev,
                                selectedUserMessage: {
                                    ...prev.selectedUserMessage,
                                    output: {
                                        ...prev.selectedUserMessage.output,
                                        list: prev.selectedUserMessage.output.list.map(
                                            (item: Message, idx: number) =>
                                                idx !==
                                                prev.selectedUserMessage.output
                                                    .list.length -
                                                    1
                                                    ? item
                                                    : {
                                                          ...item,
                                                          contents: (
                                                              item.contents ||
                                                              []
                                                          ).map((item) =>
                                                              item.id !==
                                                              userMessage.latestContentId
                                                                  ? item
                                                                  : {
                                                                        ...item,
                                                                        isSent: true,
                                                                    }
                                                          ),
                                                      }
                                        ),
                                    },
                                },
                            };
                        });
                    }
                } else {
                    isFirstLatestMessage.current = false;
                }
            });
            return unsubscribe;
        }
    }, [messageState.selectedUser, user]);

    useEffect(() => {
        if (user && messageState.selectedUser) {
            MessageService.seen({
                userId: user.uid,
                receiverId: messageState.selectedUser.id,
            });
            setMessageState((prev) => ({
                ...prev,
                selectedUserMessage: {
                    ...prev.selectedUserMessage,
                    input: {
                        ...prev.selectedUserMessage.input,
                        userId: user.uid,
                        receiverId: messageState.selectedUser!.id,
                    },
                },
            }));
        }
    }, [messageState.selectedUser, user]);

    useEffect(() => {
        if (messageState.selectedUserMessage.output.list.length > 0) {
            if (!isFirst.current) {
                setMessageState((prev) => ({
                    ...prev,
                    isNewMessage: false,
                }));
            } else {
                isFirst.current = false;
            }
        }
    }, [messageState.selectedUserMessage.output.list]);

    useEffect(() => {
        getListSearchUsers();
    }, [debouncedSearch]);

    useEffect(() => {
        setMessageState((prev) => ({
            ...prev,
            messageInput: {
                ...prev.messageInput,
                imageUrls: selectedListFile,
            },
        }));
    }, [selectedListFile]);

    useEffect(() => {
        getListMessages();
    }, [
        messageState.selectedUserMessage.input.page,
        messageState.selectedUserMessage.input.userId,
        messageState.selectedUserMessage.input.receiverId,
    ]);

    return (
        <MessageContext.Provider
            value={{
                messageState,
                messageAction: {
                    search,
                    openSearch,
                    closeSearch,
                    switchUser,
                    onTypeMessageText,
                    onChooseImages: (e) => onSelectMultipleFile(e, true),
                    onDeleteImageInput,
                    onPasteImage: (e) => onPasteFile(e, true),
                    handleSendMessage,
                    loadMoreMessage,
                },
            }}
        >
            {children}
        </MessageContext.Provider>
    );
};
