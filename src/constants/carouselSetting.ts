type Settings = {
    arrows: boolean;
    speed: number;
    slidesToShow: number;
    slidesToScroll: number;
    swipe: boolean;
};

type CarouselSetting = {
    defaultSetting: Settings;
    characterSnippetSm: Settings;
    characterSnippetLg: Settings;
    bookSnippetSm: Settings;
    bookSnippetLg: Settings;
    bookSnippetLibraryLg: Settings;
    bannerMd: Settings;
};

const defaultSetting: Settings = {
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: true,
};

const bookSnippetSm: Settings = {
    ...defaultSetting,
    slidesToShow: 3,
    slidesToScroll: 3,
};

const bookSnippetLg: Settings = {
    ...defaultSetting,
    slidesToShow: 4,
    slidesToScroll: 4,
};

const characterSnippetSm: Settings = {
    ...defaultSetting,
    slidesToShow: 3,
    slidesToScroll: 3,
};

const characterSnippetLg: Settings = {
    ...defaultSetting,
    slidesToShow: 6,
    slidesToScroll: 6,
};

const bookSnippetLibraryLg: Settings = {
    ...defaultSetting,
    slidesToShow: 5,
    slidesToScroll: 5,
};

const bannerMd: Settings = {
    ...defaultSetting,
    slidesToShow: 2,
    slidesToScroll: 2,
};

export const carouselSetting: CarouselSetting = {
    defaultSetting,
    characterSnippetLg,
    characterSnippetSm,
    bookSnippetSm,
    bookSnippetLg,
    bookSnippetLibraryLg,
    bannerMd,
};
