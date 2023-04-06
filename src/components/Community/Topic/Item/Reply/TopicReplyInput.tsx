import InputText from "@/components/Input/InputText";
import { defaultTopicReplyForm, Topic, TopicReply } from "@/models/Topic";
import { UserModel } from "@/models/User";
import { Button, Flex } from "@chakra-ui/react";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import React, { useState } from "react";

type TopicReplyInputProps = {
    topic: Topic;
    user: UserModel;
    onSubmit: (topicReplyForm: TopicReply) => Promise<void>;
};

const TopicReplyInput: React.FC<TopicReplyInputProps> = ({
    topic,
    user,
    onSubmit,
}) => {
    const [topicReplyForm, setTopicReplyForm] = useState<TopicReply>({
        ...defaultTopicReplyForm,
        topicId: topic.id!,
        creatorId: user.uid,
        creatorDisplayName: user.displayName!,
        creatorImageUrl: user.photoURL || undefined,
    });
    const [loading, setLoading] = useState(false);

    return (
        <Flex direction="column" align="flex-end">
            <InputText
                isMultipleLine
                value={topicReplyForm.replyText}
                height="150px"
                placeholder="Để lại ý kiến..."
                onInputChange={(e) => {
                    setTopicReplyForm((prev) => ({
                        ...prev,
                        replyText: e.target.value,
                    }));
                }}
            />
            <Button
                mt={2}
                w="28"
                isLoading={loading}
                onClick={async () => {
                    setLoading(true);
                    await onSubmit({
                        ...topicReplyForm,
                        createdAt: serverTimestamp() as Timestamp,
                    });
                    setTopicReplyForm({
                        ...defaultTopicReplyForm,
                        topicId: topic.id!,
                        creatorId: user.uid,
                        creatorDisplayName: user.displayName!,
                        creatorImageUrl: user.photoURL || undefined,
                    });
                    setLoading(false);
                }}
            >
                Gửi
            </Button>
        </Flex>
    );
};
export default TopicReplyInput;
