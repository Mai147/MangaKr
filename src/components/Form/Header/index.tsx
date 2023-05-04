import { Flex, Button, Text, Link, HStack } from "@chakra-ui/react";
import React, { useState } from "react";

type FormHeaderProps = {
    title: string;
    backTitle: string;
    backHref: string;
};

const FormHeader: React.FC<FormHeaderProps> = ({
    backHref,
    backTitle,
    title,
}) => {
    return (
        <Flex align="center" justify="space-between">
            <Text fontSize={{ base: 20, md: 24 }} fontWeight={600}>
                {title}
            </Text>
            <HStack spacing={4} ml={4}>
                <Link href={backHref} _hover={{ textDecoration: "none" }}>
                    <Button variant="outline" minW={28}>
                        {backTitle}
                    </Button>
                </Link>
                {/* <Button
                    w={28}
                    ml={8}
                    isLoading={loading}
                    onClick={async () => {
                        setLoading(true);
                        await onSubmit();
                        setLoading(false);
                    }}
                >
                    Lưu
                </Button> */}
            </HStack>
        </Flex>
    );
};
export default FormHeader;
