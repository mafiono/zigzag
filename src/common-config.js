let config = {};

config.common = {
  sportEnabled: true,
  s3Url: "https://s3-eu-west-1.amazonaws.com",
  s3CloudFrontUrl: "https://d32wwkuryjkg7f.cloudfront.net",
  s3CloudFrontAssets: "https://d1ridz0c354lu7.cloudfront.net",
  assets: {
    img: {
      path: "/img/zigzagsport",
      other: "/img/zigzagsport/other",
      svg: "/img/zigzagsport/svg",
      providerPaths: {
        smallLogos: "/providers/small",
        bigLogos: "/providers/big",
      },
    },
  },
  defaultLang: "en",
  currencies: ["aud", "rub", "pln", "sek"],
  depositValues: {
    aud: [20, 50, 70, 100, 200],
    rub: [1000, 2000, 5000, 10000, 15000],
    pln: [50, 100, 300, 500, 1000],
    sek: [200, 500, 700, 1000, 2000],
  },
  depositStep: {
    eur: 10,
    rub: 300,
    pln: 50,
    sek: 300,
  },
  languages: {
    en: {
      localeCountry: "GB",
      name: "English",
    },
    ru: {
      localeCountry: "RU",
      name: "Русский",
    },
    pl: {
      localeCountry: "PL",
      name: "Polski",
    },
    de: {
      localeCountry: "DE",
      name: "Deutsche",
    },
    ro: {
      localeCountry: "RO",
      name: "Română",
    },
    zh: {
      localeCountry: "CN",
      name: "中文",
    },
    uk: {
      localeCountry: "UA",
      name: "Українська",
    },
    tr: {
      localeCountry: "TR",
      name: "Türk",
    },
    pt: {
      localeCountry: "PT",
      name: "Português",
    },
  },
  translationsCacheTime: 600000,
  socketsUrl: "http://n.api.geckodev.test:5000", //change on prod
  socketDomain: "zs",
  meta: {
    project: "ZigZagSport",
    titleCommon: "ZigZagSport - Best Online Sportsbook & Casino",
    descriptionCommon: "ZigZagSport - Top Online Sportsbook & Casino",
    keywordsCommon:
      "ZigZagSport, online, casino, slots, sport, SportBook, roulette",
  },
  accountPages: [
    {
      link: "deposit",
      label: "Deposit",
    },
    {
      link: "withdraw",
      label: "Withdrawals",
    },
    {
      link: "withdraw-cancel",
      label: "Cancel withdraw",
    },
    {
      link: "transaction-history",
      label: "Transaction history",
    },
    {
      link: "play-history",
      label: "Play history",
    },
    {
      link: "promo",
      label: "Promo code",
    },
    {
      link: "casino-bonus",
      label: "Casino bonus",
    },
    {
      link: "sport-bonus",
      label: "Sport bonus",
    },
    {
      link: "profile",
      label: "Profile",
    },
    {
      link: "document-verification",
      label: "Documents",
    },
    {
      link: "change-password",
      label: "Change password",
    },
  ],
  contentPages: [
    {
      link: "about",
      label: "About Us",
    },
    {
      link: "privacy-policy",
      label: "Privacy Policy",
    },
    {
      link: "rules",
      label: "Terms and Conditions",
    },
    {
      link: "bonus-policy",
      label: "Bonus Policy",
    },
    {
      link: "responsible-gaming",
      label: "Responsible Gaming",
    },
    {
      link: "faq",
      label: "FAQ",
    },
    {
      link: "sport-rules",
      label: "Sport Rules",
    },
    {
      link: "partners",
      label: "Partners",
    },
  ],
  registrationFields: [
    ["login", "password", "email", "name", "surname", "birthDay", "gender"],
    [
      "country",
      "city",
      "phone",
      "currency",
      "promocode",
      "autobonus",
      "sms",
      "accept",
    ],
  ],
  editFields: [
    "name",
    "surname",
    "email",
    "address",
    "country",
    "city",
    "birthDay",
    "phone",
    "zipCode",
    "gender",
  ],
  trackCookieMaxAge: 2592000,
  recommendedCategory: {
    name: "recommended",
    maxLength: 8,
  },
  license: {
    path: "/license",
    url: "https://checkbetcasino.tech/license",
  },
  social: [
    "facebook",
    "google",
    "vkontakte",
    "mailru",
    "yandex",
    "odnoklassniki",
  ],
  socialLinks: [
     {
         name: 'facebook',
         link: 'https://www.facebook.com/zigzagsport.en/',
         linkru: 'https://www.facebook.com/ZigZagSport/'
     },{
         name: 'vkontakte',
         link: 'https://vk.com/zigzagsport',
         onlyRu: true
     },{
    
         name: 'telegram',
         link: 'https://t.me/ZigZag777Sport',
         linkru: 'https://t.me/zigzagsport',
    
     },{
         name: 'instagram',
         link: 'https://www.instagram.com/zigzagsport_en/',
         linkru: 'https://www.instagram.com/zigzagsport/'
     },{
         name: 'mailru',
         link: 'https://my.mail.ru/community/zigzagsport',
         onlyRu: true
     }
  ],
  searchLimit: 5,
};

config.games = {
  // thumsbUrl: config.common.s3CloudFrontAssets + '/common-game-images/img/',
  thumbsUrl: config.common.s3CloudFrontUrl + "/img/",
  bgsUrl: config.common.s3CloudFrontAssets + "/common-game-images/bg/",
  categories: [
    "all",
    "roulette",
    "popular",
    "new",
    "tv_games",
    "slots",
    "table",
    "other",
    "live-casino",
    "virtual-sport",
  ],
  menuCategories: ["popular", "slots", "roulette", "new", "other"],
  sideCategories: ["new", "popular", "tv_games", "slots", "table", "other"],
  tags: [
    "sci-fi",
    "fantasy",
    "sport",
    "history-myth",
    "romantic",
    "summertime",
    "animals",
    "action-adventures",
    "fruits",
    "movies-tv-show-music",
    "luxury",
    "horror",
    "asian",
    "holidays",
    "retro",
    "casual",
  ],
  cacheTime: 600000, //milliseconds
  cacheCheckTimeout: 30000, //milliseconds
  paginatorLoadLimit: 60,
  mobileIframe: true,
};

config.providers = [
  {
    name: "playngo",
    title: "Play'n GO",
    restricted: [],
    currencies: [],
  },
  {
    name: "microgaming",
    title: "Microgaming",
    restricted: [],
  },
  {
    name: "spribe",
    title: "Spribe",
    restricted: [],
  },
  {
    name: "apollo_games",
    title: "Apollo Games",
    restricted: [],
  },
  {
    name: "aristocrat",
    title: "Aristocrat",
    restricted: [],
  },
  {
    name: "cqgaming",
    title: "CQ Gaming",
    restricted: [],
  },
  {
    name: "gaminator",
    title: "Gaminator",
    restricted: [],
  },
  {
    name: "greentube",
    title: "Greentube",
    restricted: [],
  },
  {
    name: "hacksaw",
    title: "Hacksaw",
    restricted: [],
  },
  {
    name: "igt",
    title: "IGT",
    restricted: [],
  },
  {
    name: "kajot",
    title: "Kajot",
    restricted: [],
  },
  {
    name: "konami",
    title: "Konami",
    restricted: [],
  },
  {
    name: "merkur",
    title: "Merkur",
    restricted: [],
  },
  {
    name: "pushgaming",
    title: "Push Gaming",
    restricted: [],
  },
  {
    name: "relax gaming",
    title: "Relax Gaming",
    restricted: [],
  },
  {
    name: "spadegaming",
    title: "Spade Gaming",
    restricted: [],
  },
  {
    name: "wmg",
    title: "WMG",
    restricted: [],
  },
  {
    name: "yggdrasil",
    title: "Yggdrasil",
    disabled: true,
    restricted: ["SE"],
  },
  {
    name: "evolutiongaming",
    title: "Evolution Gaming",
    restricted: [],
  },
  {
    name: "netent",
    title: "Netent",
    restricted: [],
  },
  {
    name: "pragmatic_play",
    title: "Pragmatic Play",
    restricted: [],
  },
  {
    name: "red_tiger",
    title: "Red Tiger",
    restricted: [],
  },
  {
    name: "elk_studios",
    title: "ELK Studios",
    restricted: [],
  },
  {
    name: "thunderkick",
    title: "Thunderkick",
    restricted: [],
  },
  {
    name: "playtech",
    title: "Playtech",
    restricted: [],
  },
  {
    name: "kalamba_games",
    title: "Kalamba Games",
    restricted: [],
  },
  {
    name: "igrosoft",
    title: "Igrosoft",
    restricted: [],
  },
  {
    name: "quickfire",
    title: "Quickfire",
    restricted: [],
  },
  {
    name: "egt",
    title: "EGT",
    disabled: false,
    restricted: [],
  },
  {
    name: "amatic",
    title: "Amatic",
    restricted: [],
  },
  {
    name: "habanero",
    title: "Habanero",
    restricted: [],
  },
  {
    name: "quickspin",
    title: "Quickspin",
    restricted: ["ES"],
  },
  {
    name: "booming_games",
    title: "Booming Games",
    restricted: [],
  },
  {
    name: "blueprint_gaming",
    title: "Blueprint Gaming",
    restricted: ["CA"],
  },
  {
    name: "playson",
    title: "Playson",
    restricted: [],
  },
  {
    name: "spinomenal",
    title: "Spinomenal",
    restricted: [],
  },
  {
    name: "ezugi",
    title: "Ezugi",
    restricted: [],
  },
  {
    name: "wazdan",
    title: "Wazdan",
    restricted: [],
  },
  {
    name: "betsoft_games",
    title: "Betsoft Games",
    restricted: [], //no restricted countries
  },
  {
    name: "ainsworth",
    title: "Ainsworth",
    restricted: [],
  },
  {
    name: "big_time_gaming",
    title: "Big Time Gaming",
    restricted: [],
  },
  {
    name: "realistic-games",
    title: "Realistic Games",
    restricted: [],
  },
  {
    name: "lightning_box",
    title: "Lightning Box",
    restricted: [],
  },
  {
    name: "casino_technology",
    title: "Casino Technology",
    restricted: [],
  },
  {
    name: "endorphina",
    title: "Endorphina",
    restricted: [],
  },
  {
    name: "gamevy",
    title: "Gamevy",
    restricted: [],
  },
  {
    name: "games-lab",
    title: "Games Lab",
    disabled: true,
    restricted: [],
  },
  {
    name: "boomerang",
    title: "Boomerang",
    disabled: true,
    restricted: [],
  },
  {
    name: "stakelogic",
    title: "Stake Logic",
    restricted: [],
  },
  {
    name: "iron_dog_studios",
    title: "Iron Dog",
    restricted: [],
  },
  {
    name: "gamefish-global",
    title: "Gamefish Global",
    restricted: [],
  },
  {
    name: "splitrock-gaming",
    title: "Splitrock Gaming",
    restricted: [],
  },
  {
    name: "betradar",
    title: "Betradar",
    restricted: [],
  },
  {
    name: "betgames_tv",
    title: "BetGames.TV",
    restricted: [],
  },
  {
    name: "kiron",
    title: "Kiron",
    restricted: [],
  },
  {
    name: "1x2_g_a",
    title: "1x2 Gaming",
    restricted: [],
  },
  {
    name: "nolimit_city",
    title: "Nolimit City",
    restricted: [],
  },
  {
    name: "red_rake_gaming",
    title: "Red Rake Gaming",
    restricted: [],
  },
  {
    name: "august_gaming",
    title: "August Gaming",
    restricted: [],
  },
  {
    name: "booongo",
    title: "Booongo",
    restricted: [],
  },
];
config.providersArray = config.providers
  .filter((provider) => !provider.disabled)
  .map((provider) => {
    return provider.name;
  });
config.providersSlider = [
  "thunderkick",
  "quickspin",
  "yggdrasil",
  "booming_games",
  "ezugi",
  "habanero",
];

config.sliders = {
  imgUrl: config.common.s3CloudFrontAssets + "/cms-sliders-test/88", //change on prod
};
config.bonuses = {
  imgUrl: config.common.s3CloudFrontAssets + "/cms-bonus-test/88", //change on prod
};
config.payment = {
  payMethodUrl: config.common.s3CloudFrontAssets + "/pay-method-test",
  footerPayments: [
    "iconPay_Bitcoin.svg",
    "iconPay_EcoPayz.svg",
    "iconPay_Eps.svg",
    "iconPay_Euteller.svg",
    "iconPay_MasterCard.svg",
    "iconPay_Neteller.svg",
    "iconPay_PaySafeCard.svg",
    "iconPay_Skrill.svg",
    "iconPay_Visa.svg",
    "iconPay_Interac.png",
  ],
  footerPaymentsUrl:
    config.common.s3CloudFrontAssets +
    config.common.assets.img.path +
    "/payments",
  exchange: {
    _image: config.common.s3CloudFrontAssets + "/img/common/exchange/image.png",
    _imageRu:
      config.common.s3CloudFrontAssets + "/img/common/exchange/image_ru.png",
    _link: "https://www.bestchange.com/?p=1239169",
    _linkRu: "https://www.bestchange.ru/?p=1239169",
    name: "exchange",
    currency: "LTC",
    imagePayments:
      config.common.s3CloudFrontAssets + "/img/common/exchange/payments.png",
    getImage: function (lang) {
      return lang === "ru" ? this._imageRu : this._image;
    },
    getLink: function (lang) {
      return lang === "ru" ? this._linkRu : this._link;
    },
  },
};
config.tournaments = {
  tournamentsUrl: config.common.s3CloudFrontAssets + "/cms-tournaments-test",
};
config.providersUrl =
  config.common.s3CloudFrontAssets +
  config.common.assets.img.path +
  "/providers";
config.winTableLength = 8;
config.TawkOptions = {
  tawkSrc: "https://embed.tawk.to/5afd8f19227d3d7edc2569a8/default",
};
config.documentVerification = {
  MIN_FILE_SIZE: 52428,
  MAX_FILE_SIZE: 52428800,
  IMAGE_MIN_WIDTH: 500,
  IMAGE_MIN_HEIGHT: 500,
  CANVAS_IMAGE_WIDTH: 2000,
  CANVAS_IMAGE_HEIGHT: 2000,
  CANVAS_IMAGE_SIZE: 5242880,
  VALID_EXTENSIONS: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
};
config.initialImgPath =
  config.common.s3CloudFrontAssets + config.common.assets.img.path + "/";
config.initialMenuImagePath =
  config.common.s3CloudFrontAssets +
  config.common.assets.img.path +
  "/account-menu-icons/";

config.mainSitePath = "checkbetcasino.tech";
config.mainSiteRestrictedCountries = ["CW", "IL", "US"];
config.allSitesRestrictedCountries = ["US"];

config.promo = {
  images: [
    config.common.s3CloudFrontAssets +
      config.common.assets.img.path +
      "/promo/type_1.jpg",
    config.common.s3CloudFrontAssets +
      config.common.assets.img.path +
      "/promo/type_1.jpg",
    config.common.s3CloudFrontAssets +
      config.common.assets.img.path +
      "/promo/type_2.jpg",
  ],
};
config.captchaUrl = "https://www.google.com/recaptcha/api.js";

config.cryptoImg = (currency) =>
  config.common.s3CloudFrontAssets +
  "/img/common/crypto-logos/" +
  currency.toLowerCase() +
  ".png";
config.cpWithdrawName = "cp_crypto";
config.avatars = {
  all: [
    "01.jpg",
    "02.jpg",
    "03.jpg",
    "04.jpg",
    "05.jpg",
    "06.jpg",
    "07.jpg",
    "08.jpg",
    "09.jpg",
    "10.jpg",
    "11.jpg",
    "12.jpg",
    "13.jpg",
    "14.jpg",
    "15.jpg",
    "16.jpg",
    "17.jpg",
    "18.jpg",
    "19.jpg",
    "20.jpg",
    "21.jpg",
    "22.jpg",
    "23.jpg",
    "24.jpg",
    "25.jpg",
    "26.jpg",
    "27.jpg",
    "28.jpg",
    "29.jpg",
    "30.jpg",
    "31.jpg",
    "32.jpg",
    "33.jpg",
    "34.jpg",
    "35.jpg",
    "36.jpg",
    "37.jpg",
    "38.jpg",
    "39.jpg",
    "40.jpg",
    "41.jpg",
    "42.jpg",
    "43.jpg",
    "44.jpg",
    "45.jpg",
    "46.jpg",
    "47.jpg",
    "48.jpg",
    "49.jpg",
    "50.jpg",
    "51.jpg",
    "52.jpg",
    "53.jpg",
    "54.jpg",
    "55.jpg",
    "56.jpg",
    "57.jpg",
    "58.jpg",
    "59.jpg",
    "60.jpg",
    "61.jpg",
    "62.jpg",
    "63.jpg",
    "64.jpg",
    "65.jpg",
    "66.jpg",
    "67.jpg",
    "68.jpg",
    "69.jpg",
    "70.jpg",
    "74.jpg",
    "75.jpg",
    "76.jpg",
    "77.jpg",
  ],
  avatarPath: "/avatars",
  baseAvatar: "77.jpg",
};

export default config;
