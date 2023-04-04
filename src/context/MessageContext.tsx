import { firebaseRoute } from "@/constants/firebaseRoutes";
import { MESSAGE_PAGE_COUNT, SEARCH_PAGE_COUNT } from "@/constants/pagination";
import { fireStore } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import useDebounce from "@/hooks/useDebounce";
import usePagination, {
    defaultPaginationInput,
    PaginationInput,
} from "@/hooks/usePagination";
import useSelectFile from "@/hooks/useSelectFile";
import { Message } from "@/models/Message";
import { UserMessageSnippet, UserModel, UserSnippet } from "@/models/User";
import MessageService from "@/services/MessageService";
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import { ChangeEvent, createContext, useEffect, useRef, useState } from "react";

interface MessagePaginationInput extends PaginationInput {
    userId: string;
    receiverId: string;
    exceptionCount?: number;
}

const defaultMessagePaginationInput: MessagePaginationInput = {
    ...defaultPaginationInput,
    pageCount: MESSAGE_PAGE_COUNT,
    userId: "",
    receiverId: "",
    exceptionCount: 0,
};

type MessageState = {
    listUsers: UserMessageSnippet[];
    listSearchUsers: UserModel[];
    selectedUser?: UserSnippet;
    selectedUserMessageList: Message[];
    selectedMessagePaginationInput?: MessagePaginationInput;
    isNewMessage: boolean;
    messageInput: {
        content: string;
        imageUrls: string[];
    };
    searchValue: string;
    isSearching: boolean;
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

const defaultSearchInput: PaginationInput = {
    ...defaultPaginationInput,
    pageCount: SEARCH_PAGE_COUNT,
};

const defaultMessageState: MessageState = {
    listUsers: [],
    listSearchUsers: [],
    selectedUserMessageList: [],
    messageInput: {
        content: "",
        imageUrls: [],
    },
    isNewMessage: false,
    searchValue: "",
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
    const [messageState, setMessageState] =
        useState<MessageState>(defaultMessageState);
    const [searchInput, setSearchInput] =
        useState<PaginationInput>(defaultSearchInput);
    const [messagePaginationInput, setMessagePaginationInput] =
        useState<MessagePaginationInput>(defaultMessagePaginationInput);
    const debouncedSearch = useDebounce(messageState.searchValue, 300);
    const {
        onSelectMultipleFile,
        selectedListFile,
        onPasteFile,
        setSelectedListFile,
    } = useSelectFile();
    const { getUsers, getMessages } = usePagination();
    const isFirst = useRef(true);

    const getListSearchUsers = async () => {
        const res = await getUsers({
            ...searchInput,
            searchValue: messageState.searchValue,
        });
        setMessageState((prev) => ({
            ...prev,
            listSearchUsers: res.users as UserModel[],
        }));
    };

    const getListMessages = async () => {
        if (
            messagePaginationInput.userId &&
            messagePaginationInput.receiverId
        ) {
            setMessagePaginationInput((prev) => ({
                ...prev,
                loading: true,
            }));
            const res = await getMessages({
                ...messagePaginationInput,
            });
            setMessageState((prev) => ({
                ...prev,
                selectedUserMessageList: [
                    ...res.messages.reverse(),
                    ...prev.selectedUserMessageList,
                ],
            }));
            setMessagePaginationInput((prev) => ({
                ...prev,
                totalPage: res.totalPage || 0,
                isFirst: false,
                loading: false,
            }));
        }
    };

    const getLatestMessages = async (
        userId: string,
        receiverId: string,
        messageId: string
    ) => {
        if (!isFirst.current) {
            const message = await MessageService.get({
                messageId,
                receiverId,
                userId,
            });
            if (message) {
                if (
                    !messageState.selectedUserMessageList.find(
                        (item) => item.id === message.id
                    )
                ) {
                    setMessagePaginationInput((prev) => ({
                        ...prev,
                        exceptionCount: prev.exceptionCount || 0 + 1,
                    }));
                }
                setMessageState((prev) => ({
                    ...prev,
                    selectedUserMessageList: [
                        ...prev.selectedUserMessageList.filter(
                            (item) => item.id !== message.id
                        ),
                        message,
                    ],
                    isNewMessage: true,
                }));
            }
        } else {
            isFirst.current = false;
        }
    };

    const loadMoreMessage = () => {
        setMessagePaginationInput((prev) => ({
            ...prev,
            page: prev.page + 1,
            isNext: true,
        }));
    };

    const search = (searchValue: string) => {
        setMessageState((prev) => ({
            ...prev,
            searchValue,
            isSearching: true,
        }));
    };

    const openSearch = () => {
        setMessageState((prev) => ({
            ...prev,
            isSearching: true,
            searchValue: "",
        }));
    };

    const closeSearch = () => {
        setMessageState((prev) => ({
            ...prev,
            isSearching: false,
            searchValue: "",
        }));
    };

    const switchUser = (user: UserSnippet) => {
        setMessageState((prev) => ({
            ...prev,
            selectedUser: user,
            isSearching: false,
        }));
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
            const { selectedUser, messageInput } = messageState;
            const res = await MessageService.create({
                senderId: user.uid,
                senderDisplayName: user.displayName!,
                senderImageUrl: user.photoURL,
                receiverId: selectedUser.id,
                receiverDisplayName: selectedUser.displayName,
                receiverImageUrl: selectedUser.imageUrl,
                messageForm: {
                    latestContent: messageInput.content,
                    imageUrls: messageInput.imageUrls,
                    type: "SEND",
                },
            });
            if (res) {
                setMessageState((prev) => ({
                    ...prev,
                    messageInput: {
                        content: "",
                        imageUrls: [],
                    },
                }));
                setSelectedListFile([]);
            }
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

    useEffect(() => {
        if (messageState.listUsers && !messageState.selectedUser) {
            setMessageState((prev) => ({
                ...prev,
                selectedUser: messageState.listUsers[0],
            }));
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
                if (user && messageState.selectedUser) {
                    MessageService.seen({
                        userId: user.uid,
                        receiverId: messageState.selectedUser.id,
                    });
                }
                setMessageState((prev) => ({
                    ...prev,
                    listUsers: userMessageSnippets,
                }));
            });
            return unsubscribe;
        }
    }, [user]);

    useEffect(() => {
        isFirst.current = true;
        setMessagePaginationInput(defaultMessagePaginationInput);
        setMessageState((prev) => ({
            ...prev,
            selectedUserMessageList: [],
            isNewMessage: true,
        }));
    }, [messageState.selectedUser]);

    useEffect(() => {
        if (user && messageState.selectedUser) {
            const { selectedUser } = messageState;
            const q = doc(
                fireStore,
                firebaseRoute.getUserMessageRoute(user.uid),
                selectedUser.id
            );
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const userMessage = snapshot.data() as UserMessageSnippet;
                if (userMessage) {
                    getLatestMessages(
                        user.uid,
                        selectedUser.id,
                        userMessage.messageId
                    );
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
            setMessagePaginationInput((prev) => ({
                ...prev,
                userId: user.uid,
                receiverId: messageState.selectedUser!.id,
            }));
        }
    }, [messageState.selectedUser, user]);

    useEffect(() => {
        if (!isFirst.current) {
            setMessageState((prev) => ({
                ...prev,
                isNewMessage: false,
            }));
        }
    }, [messageState.selectedUserMessageList]);

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
        messagePaginationInput.page,
        messagePaginationInput.userId,
        messagePaginationInput.receiverId,
    ]);

    return (
        <MessageContext.Provider
            value={{
                messageState: {
                    ...messageState,
                    selectedMessagePaginationInput: messagePaginationInput,
                },
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
