import React, { useState, useEffect, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import queryString from "query-string";
import { UserActions } from "../user";
import Sidebar from "../../sidebar/components/sidebar";
import GameIndex from "../../games/components/game-index";
import GamePage from "../../games/components/game-page";
import GamePopUp from "../../other/components/game-popup";
import Registration from "./registration";
import Account from "../../account/components";
import FavoritePage from "../../favorite/components/favorite";
import Tournaments from "../../tournaments/components/tournaments";
import Bonuses from "../../bonuses/components/bonuses";
import Footer from "../../footer/components/footer";
import Page from "../../pages/components/pages";
import Popup from "../../utils-components/popup";
import Deposit from "../../account/components/deposit";
import DepositPopUp from "../../account/components/deposit/popup";
import headerScrollFixer from "../header-scroll";
import "animate.css";

import tawk from "../../tawk";
import helpers from "../../helpers";
import user from "../user";
import sockets from "../../sockets";
import ReferLinkChecker from "../link-check";
import Mail from "./mail";
import sportMethods from "./sport-methods";
import updatePopUp from "./update-popup";
import UpdateMessage from "./update-message";

const SocialRegistration = React.lazy(() =>
  import("./social-block")
);
const Login = React.lazy(() => import("./login"));

const languageParam = helpers.routing.languageParam;

const gamePaths = [
  languageParam,
  languageParam + "/games/search/:name?",
  languageParam + "/games/c/" + helpers.routing.gameCategoriesParam,
  languageParam +
    "/games/c/" +
    helpers.routing.gameCategoriesParam +
    "/p/" +
    helpers.routing.gameProvidersParam,
  languageParam + "/games/t/" + helpers.routing.gameTagsParam,
];

const gamePagePaths = [
  languageParam + "/games/:mode(play|demo)/:game",
  languageParam,
];
let previousURL = "";

function pathMatch(url, language) {
  return !!(
    url.indexOf(`/${language}/games/search/`) || url === `/${language}/`
  );
}

function Home(props) {
  const [isLoaded, load] = useState(false),
    language = props.match.params.language,
    notIndex =
      props.location.pathname !== `/${language}/` &&
      props.location.pathname !== `/${language}`,
    sportPage = !notIndex || ~props.location.pathname.indexOf("/esport");

  useEffect(() => {
    let previousMatch = pathMatch(previousURL, language),
      currentMatch = pathMatch(props.location.pathname, language);

    if (!previousMatch || (previousMatch && !currentMatch)) {
      if (window && window.scroll) {
        window.scroll(0, 0);
      }
    }
    previousURL = props.location.pathname;

    if (sportPage) {
      props.dispatch(UserActions.setIsSport(true));
    } else if (props.isSport) {
      props.dispatch(UserActions.setIsSport(false));
    }
  }, [language, props, props.location.pathname, sportPage]);

  useEffect(() => {
    user
      .handleInit(props, language)
      .then(() => {
        tawk.createChat();
      })
      .catch((err) => {
        console.error("Error creating Tawk chat");
      })
      .then(() => {
        load(true);
        sockets.connectSockets();
      })
      .catch((err) => {
        load(true);
        console.log("new Error", err);
      });
  }, [language, props]);

  useEffect(() => {
    if (isLoaded) {
      sportMethods();
      headerScrollFixer();
      ReferLinkChecker();
      updatePopUp();
    }
  }, [isLoaded]);

  if (props.redirect && props.redirect !== props.match.url) {
    return <Redirect to={props.redirect} />;
  }

  if (isLoaded) {
    return (
      <>
        <Switch>
          <Route
            exact
            path={gamePaths}
            render={(renderProps) => (
              <GameIndexPage
                language={language}
                notIndex={notIndex}
                online={props.online}
                {...renderProps}
              />
            )}
          />
          <Route
            path={languageParam + "/games/:mode(play|demo)/:game"}
            render={(props) => <Sidebar {...props} />}
          />
          <Route
            path={
              languageParam + "/account/" + helpers.routing.accountPagesParam
            }
            render={(props) => <Main {...props} load={Account} />}
          />
          <Route
            path={languageParam + "/registration"}
            render={(props) => <Main {...props} load={Registration} />}
          />
          <Route
            path={languageParam + "/p/" + helpers.routing.contentPagesParam}
            render={(props) => <Main {...props} load={ContentPage} />}
          />
          <Route
            path={languageParam + "/bonuses/:bonus?"}
            render={(props) => <Main {...props} load={BonusPage} />}
          />
          <Route
            path={languageParam + "/tournaments/:tournament?"}
            render={(props) => <Main {...props} load={TournamentPage} />}
          />
          <Route exact path={languageParam + "/email/:id"} component={Mail} />
          <Route
            path={languageParam + "/favorite"}
            render={(props) => <Main {...props} load={FavoritePage} />}
          />
          <Route path={languageParam} component={RedirectToLanguage} />
        </Switch>
        <Suspense fallback={null}>
          <Route
            path={languageParam}
            render={(renderProps) => (
              <MatchQueryString {...renderProps} online={props.online} />
            )}
          />
        </Suspense>
        <Route
          path={gamePagePaths}
          render={(props) => <GamePage {...props} />}
        />
      </>
    );
  } else {
    return null;
  }
}

function PreMain(props) {
  const LoadComponent = props.load;

  return (
    <React.Fragment>
      <Sidebar {...props} />
      <main>
        <LoadComponent {...props} />
      </main>
      <Footer contentPage={props.match.params.contentPage} />
    </React.Fragment>
  );
}

const Main = React.memo(PreMain);

function MatchQueryString(props) {
  if (!props.location.search) {
    return null;
  }
  const closePopUp = () =>
      props.history.replace(props.history.location.pathname),
    queryValues = queryString.parse(props.location.search),
    queryExist = (query) => typeof queryValues[query] !== "undefined",
    stateExist = (query) => props.location.state?.[query];

  if (queryExist("login") && !props.online) {
    return (
      <Popup closeHandler={closePopUp} fullContainer>
        <Login closePopUp={closePopUp} />
      </Popup>
    );
  }
  if (
    queryExist("social-registration") &&
    !props.online &&
    stateExist("social")
  ) {
    return (
      <Popup closeHandler={closePopUp}>
        <SocialRegistration closeFunction={closePopUp} />
      </Popup>
    );
  }
  if (queryExist("game-popup") && stateExist("gamePopUpData")) {
    return (
      <Popup closeHandler={closePopUp} fullContainer>
        <GamePopUp closePopUp={closePopUp} />
      </Popup>
    );
  }
  if (queryExist("deposit-popup") && stateExist("depositPopUpData")) {
    return <DepositPopUp closeFunction={closePopUp} />;
  }
  if (queryExist("fast-deposit")) {
    return (
      <Popup closeHandler={closePopUp} fullContainer>
        <div className="overlay four" onClick={closePopUp} />
        <Deposit closePopUp={closePopUp} fast />
      </Popup>
    );
  }
  if (queryExist("update") && stateExist("update")) {
    return (
      <Popup closeHandler={closePopUp} fullContainer>
        <UpdateMessage closeFunction={closePopUp} />
      </Popup>
    );
  }
  return null;
}

const GameIndexPage = React.memo((props) => {
  useEffect(() => {
    if (props.notIndex) {
      document.body.classList.remove("sport_page");
    } else {
      document.body.classList.add("sport_page");
    }
    return () => {
      document.body.classList.remove("sport_page");
    };
  }, [props.location.pathname, props.notIndex]);
  return (
    <>
      <Sidebar {...props} />
      <main>
        {props.notIndex ? (
          <GameIndex {...props.match.params} />
        ) : (
          <iframe
            src={`https://sport.zigzagsport.com/SportsBook/Home?token=-&amp;d=d&amp;l=en&amp;tz=&amp;of=0&amp;ofl=&amp;customCssUrl=&amp;sportsBookView=&amp;clearSiteStyles=false&amp;resetAllStyles=false&amp;theme=`}
            allowFullScreen
            name={"gameframe_" + props.language}
            frameBorder="0"
            title="sport"
            key={"sport" + props.language}
          />
        )}
      </main>
      <Footer contentPage={props.match.params.contentPage} />
    </>
  );
});

function ContentPage({ match }) {
  return <Page contentPage={match.params.contentPage} />;
}
function BonusPage(props) {
  return <Bonuses bonus={props.match.params.bonus} {...props} />;
}
function TournamentPage(props) {
  return <Tournaments tournament={props.match.params.tournament} {...props} />;
}

const RedirectToLanguage = ({ location, match, history }) => {
  let lang = helpers.getAndSetUserLanguage(),
    redir = "/" + lang;

  if (!match.params.language) {
    let re = /^\/[a-z]{2}(\/|$)/i;
    if (re.test(location.pathname)) {
      redir =
        redir + location.pathname.slice(3) + location.search + location.hash;
    } else {
      redir = redir + location.pathname + location.search + location.hash;
    }
  }
  return <Redirect to={redir} />;
};

export { RedirectToLanguage };

const mapStateToProps = (state, _ownProps) => {
  return {
    redirect: state.CommonReducers.redirect,
    isSport: state.UserReducers.isSport,
    online: state.UserReducers.online,
  };
};

export default connect(mapStateToProps, null)(React.memo(Home));
