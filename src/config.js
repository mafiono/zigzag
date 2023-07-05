import config from "./common-config";

config.common = config.common || {};

config.common.socketsUrl = 'http://n.api.geckodev.test:5000';

config.common.license = config.common.license || {};
config.common.license.url = 'http://checkbetcasino.tech/license';

config.sliders = config.sliders || {};
config.sliders.imgUrl = config.common.s3Url + '/cms-sliders-test/86';

config.bonuses = config.bonuses || {};
config.bonuses.imgUrl = config.common.s3Url + '/cms-bonus-test/86';

config.payment = config.payment || {};
config.payment.payMethodUrl = config.common.s3Url + '/pay-method-test';

config.tournaments = config.tournaments || {};
config.tournaments.tournamentsUrl = config.common.s3Url + '/pay-tournaments-test';

config.common.socketsUrl = "https://socket.api.geckodev.eu";

config.common.license = config.common.license || {};
config.common.license.url = "https://checkbetcasino.tech/license";

config.sliders = config.sliders || {};
config.sliders.imgUrl = "https://d21emz7ceza52g.cloudfront.net/86";

config.bonuses = config.bonuses || {};
config.bonuses.imgUrl = "https://d34l3f4oisgpjr.cloudfront.net/86";

config.payment = config.payment || {};
config.payment.payMethodUrl = "https://d1bstj0yx8k7ha.cloudfront.net";

config.tournaments = config.tournaments || {};
config.tournaments.tournamentsUrl = "https://d1m1wf2lc9j2on.cloudfront.net";

export default config;
