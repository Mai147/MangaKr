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
} from "@chakra-ui/react";
import React, { useState } from "react";

type ConfirmModalProps = {
    title: string;
    content: string;
    onSubmit: () => Promise<void>;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    title,
    content,
    onSubmit,
}) => {
    const { view, isOpen, closeModal } = useModal();
    const [loading, setLoading] = useState(false);
    return (
        <Modal
            isOpen={isOpen && view === "confirmModal"}
            onClose={() => {
                closeModal();
            }}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Alert status="error">
                        <AlertIcon />
                        {content}
                    </Alert>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" mr={3} w={28} onClick={closeModal}>
                        Hủy
                    </Button>
                    <Button
                        onClick={async () => {
                            setLoading(true);
                            await onSubmit();
                            setLoading(false);
                        }}
                        w={28}
                        isLoading={loading}
                    >
                        Xác nhận
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
export default ConfirmModal;
