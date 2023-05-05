import CommunityInfoApprove from "@/components/Community/Approve/CommunityInfoApprove";
import NotAvailable from "@/components/Error/NotAvailable";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { Community } from "@/models/Community";
import { UserModel } from "@/models/User";
import CommunityService from "@/services/CommunityService";
import { Flex } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import Head from "next/head";
import React, { useEffect } from "react";

type CommunityApprovePageProps = {
    community: Community;
    user?: UserModel;
};

const CommunityApprovePage: React.FC<CommunityApprovePageProps> = ({
    community,
    user,
}) => {
    const { authAction } = useAuth();

    useEffect(() => {
        authAction.setNeedAuth(true);
        authAction.setDefaultPath(routes.getHomePage());
    }, []);

    return (
        <>
            <Head>
                <title>{`MangaKr - Cộng đồng ${
                    community?.name || ""
                } - Phê duyệt`}</title>
            </Head>
            <>
                {!community ? (
                    <NotAvailable title="Cộng đồng này không tồn tại hoặc đã bị xóa!" />
                ) : !user ? (
                    <></>
                ) : (
                    <Flex
                        direction="column"
                        p={0}
                        boxShadow="lg"
                        bg="white"
                        borderRadius={4}
                        flexGrow={1}
                    >
                        <CommunityInfoApprove community={community} />
                    </Flex>
                )}
            </>
        </>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user, user_id } = cookies(context) || null;
    if (!token) {
        context.res.writeHead(302, { Location: routes.getHomePage() });
        context.res.end();
        return {
            props: {},
        };
    } else {
        const { cid } = context.query;
        const community = await CommunityService.get({
            communityId: cid as string,
        });
        if (community) {
            const us = JSON.parse(JSON.stringify(user));
            const userRole = await CommunityService.getUserRole({
                communityId: community.id!,
                userId: user_id as string,
            });
            const res = CommunityService.canApprovePost({
                communityType: community.privacyType,
                userRole: userRole?.role,
                user: us,
            });
            if (!res) {
                context.res.writeHead(302, { Location: routes.getHomePage() });
                context.res.end();
                return {
                    props: {},
                };
            }
            return {
                props: {
                    community: community || null,
                    user: us || null,
                },
            };
        }
        return {
            props: {},
        };
    }
}

export default CommunityApprovePage;
