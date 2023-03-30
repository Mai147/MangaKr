import useModal from "@/hooks/useModal";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Alert,
    AlertIcon,
    Text,
    VStack,
    AlertStatus,
} from "@chakra-ui/react";
import React, { useState } from "react";

type ConfirmModalProps = {
    title: string;
    content: string;
    subContent?: string;
    onSubmit: () => Promise<void>;
    status?: AlertStatus;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    title,
    content,
    subContent,
    onSubmit,
    status = "error",
}) => {
    const { view, isOpen, closeModal } = useModal();
    const [loading, setLoading] = useState(false);

    const handle = async () => {
        setLoading(true);
        await onSubmit();
        setLoading(false);
    };
    return (
        <Modal isOpen={isOpen && view === "confirmModal"} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Alert status={status}>
                        <AlertIcon />
                        <VStack align="flex-start" spacing={0}>
                            <Text>{content}</Text>
                            <Text color="gray.500" fontSize={13}>
                                {subContent}
                            </Text>
                        </VStack>
                    </Alert>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" mr={3} w={28} onClick={closeModal}>
                        Hủy
                    </Button>
                    <Button onClick={handle} w={28} isLoading={loading}>
                        Xác nhận
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
export default ConfirmModal;
