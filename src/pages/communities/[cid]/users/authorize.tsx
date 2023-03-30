import CommunityUserAuthorize from "@/components/Community/Approve/CommunityUserAuthorize";
import NotAvailable from "@/components/Error/NotAvailable";
import { HOME_PAGE } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { Community } from "@/models/Community";
import { UserModel } from "@/models/User";
import CommunityService from "@/services/CommunityService";
import { Flex } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect } from "react";

type CommunityUserAuthorizePageProps = {
    community: Community;
    user?: UserModel;
};

const CommunityUserAuthorizePage: React.FC<CommunityUserAuthorizePageProps> = ({
    community,
    user,
}) => {
    const { setNeedAuth, setDefaultPath } = useAuth();

    useEffect(() => {
        setNeedAuth(true);
        setDefaultPath(HOME_PAGE);
    }, []);

    if (!community) {
        return (
            <NotAvailable title="Cộng đồng này không tồn tại hoặc đã bị xóa!" />
        );
    }
    if (!user) {
        return <></>;
    }

    return (
        <Flex
            direction="column"
            p={0}
            boxShadow="lg"
            bg="white"
            borderRadius={4}
            flexGrow={1}
        >
            <CommunityUserAuthorize community={community} />
        </Flex>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user, user_id } = cookies(context) || null;
    if (!token) {
        context.res.writeHead(302, { Location: HOME_PAGE });
        context.res.end();
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
            const res = CommunityService.canApproveUser({
                communityType: community.privacyType,
                userRole: userRole?.role,
                user: us,
            });
            if (!res) {
                context.res.writeHead(302, { Location: HOME_PAGE });
                context.res.end();
            }
            return {
                props: {
                    community,
                    user: us,
                },
            };
        }
        return {
            props: {},
        };
    }
}

export default CommunityUserAuthorizePage;
