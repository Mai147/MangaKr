import CommunityUserApprove from "@/components/Community/Approve/CommunityUserApprove";
import NotAvailable from "@/components/Error/NotAvailable";
import { routes } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { Community } from "@/models/Community";
import { UserModel } from "@/models/User";
import CommunityService from "@/services/CommunityService";
import { Flex } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect } from "react";

type CommunityUserApprovePageProps = {
    community: Community;
    user?: UserModel;
};

const CommunityUserApprovePage: React.FC<CommunityUserApprovePageProps> = ({
    community,
    user,
}) => {
    const { setNeedAuth, setDefaultPath } = useAuth();

    useEffect(() => {
        setNeedAuth(true);
        setDefaultPath(routes.getHomePage());
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
            <CommunityUserApprove community={community} />
        </Flex>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user, user_id } = cookies(context) || null;
    if (!token) {
        context.res.writeHead(302, { Location: routes.getHomePage() });
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
                context.res.writeHead(302, { Location: routes.getHomePage() });
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

export default CommunityUserApprovePage;
