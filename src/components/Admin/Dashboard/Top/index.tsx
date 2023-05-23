import BookService from "@/services/BookService";
import CommunityService from "@/services/CommunityService";
import PostService from "@/services/PostService";
import UserService from "@/services/UserService";
import { Flex, Grid, HStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import TopItem from "./TopItem";

type TopSectionProps = {};

type TopData = {
    mangas: {
        name: string;
        data: number;
        imageUrl?: string;
    };
    communities: {
        name: string;
        data: number;
        imageUrl?: string;
    };
    users: {
        name: string;
        data: number;
        imageUrl?: string;
    };
    posts: {
        name: string;
        data: number;
        imageUrl?: string;
    };
};

type TopField = {
    field: "mangas" | "users" | "communities" | "posts";
    title: string;
    subTitle: string;
};

const defaultTopData: TopData = {
    mangas: {
        name: "",
        data: 0,
    },
    communities: {
        name: "",
        data: 0,
    },
    posts: {
        name: "",
        data: 0,
    },
    users: {
        name: "",
        data: 0,
    },
};

const listTop: TopField[] = [
    {
        field: "mangas",
        title: "Manga nổi bật nhất",
        subTitle: "lượt xem",
    },
    {
        field: "communities",
        title: "Cộng đồng nhiều người tham gia nhất",
        subTitle: "thành viên",
    },
    {
        field: "users",
        title: "Tài khoản nhiều lượt theo dõi nhất",
        subTitle: "lượt theo dõi",
    },
    {
        field: "posts",
        title: "Bài viết nhiều đánh giá nhất",
        subTitle: "đánh giá",
    },
];

const TopSection: React.FC<TopSectionProps> = () => {
    const [topData, setTopData] = useState<TopData>(defaultTopData);
    const getDatas = async () => {
        const mostPopularBook = await BookService.getAll({
            bookOrders: [
                {
                    bookOrderBy: "popularity",
                    bookOrderDirection: "desc",
                },
            ],
            bookLimit: 1,
            isLock: false,
        });
        const mostPopularCommunity = await CommunityService.getAll({
            communityOrders: [
                {
                    communityOrderBy: "numberOfMembers",
                    communityOrderDirection: "desc",
                },
            ],
            communityLimit: 1,
        });
        const mostFollowUser = await UserService.getAll({
            userOrders: [
                {
                    userOrderBy: "numberOfFolloweds",
                    userOrderDirection: "desc",
                },
            ],
            userLimit: 1,
        });
        const mostReactionPost = await PostService.getAll({
            postOrders: [
                {
                    postOrderBy: "numberOfReactions",
                    postOrderDirection: "desc",
                },
            ],
            postLimit: 1,
        });
        setTopData((prev) => ({
            mangas: {
                name: mostPopularBook[0].name,
                data: mostPopularBook[0].popularity,
                imageUrl: mostPopularBook[0].imageUrl,
            },
            communities: {
                name: mostPopularCommunity[0].name,
                data: mostPopularCommunity[0].numberOfMembers,
                imageUrl: mostPopularCommunity[0].imageUrl,
            },
            users: {
                name: mostFollowUser[0].displayName!,
                data: mostFollowUser[0].numberOfFolloweds,
                imageUrl: mostFollowUser[0].photoURL!,
            },
            posts: {
                name: mostReactionPost[0].caption,
                data: mostReactionPost[0].numberOfReactions,
                imageUrl: mostReactionPost[0].creatorImageUrl!,
            },
        }));
    };

    useEffect(() => {
        getDatas();
    }, []);
    return (
        <Grid templateColumns="repeat(4, 1fr)" columnGap={4}>
            {listTop.map((item) => (
                <TopItem
                    key={item.field}
                    title={item.title}
                    name={topData[item.field].name}
                    data={topData[item.field].data}
                    imageUrl={topData[item.field].imageUrl}
                    subTitle={item.subTitle}
                />
            ))}
        </Grid>
    );
};
export default TopSection;
