import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Header from '../../components/organisms/Header';
import {
  setCurrentUser,
  setPreferenceInfo,
  setStaticPortfolio,
  setRecommendationCriterion,
} from '../../store/user';
import LoginModal from '../../components/molecules/LoginModal/';
import PreferencesForm from '../../components/templates/PreferencesForm';
import StockDetails from '../StockDetailsPage';
import PortfolioPage from '../../components/templates/PortfolioPage';
import requestUser from '../../api/requestUser';
import requestPreferenceInfo from '../../api/requestPreferenceInfo';
import { Switch, Route } from 'react-router-dom';
import PATHS from '../../constants/paths';
import '../../sass/app.scss';
import Main from '../MainPage';
import requestPortfolio from '../../api/requestPortfolio';
import setCookie from '../../utils/setCookie';
import getCookie from '../../utils/getCookie';
import uuid from 'uuid-random';
import { initializeUserStates } from '../../store/user';

const App = ({
  onInitialStatesFetched,
  onLogin,
  onLogout,
  currentUser,
  onUserUpdate,
  onPreferenceInfoUpdate,
  staticPortfolio,
  onStaticPortfolioFetched,
  setRecommendationCriterion,
}) => {
  const history = useHistory();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const loginButtonClickHandler = () => {
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    if (!currentUser) {
      setRecommendationCriterion('random');

      return;
    }

    if (
      !currentUser.preferenceInfoId
      && !staticPortfolio.length
    ) {
      setRecommendationCriterion('random');

      return;
    }

    if (!currentUser.preferenceInfoId) {
      setRecommendationCriterion('portfolio');
    }

    setRecommendationCriterion('preference');
  }, [currentUser]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) return;

    const initializeUserState = async () => {
      const { user } = await requestUser();
      let preferenceInfoResponse;

      if (user?.preferenceInfoId) {
        preferenceInfoResponse = await requestPreferenceInfo(user);
      }
      onInitialStatesFetched(user, preferenceInfoResponse?.preferenceInfo);
    };

    initializeUserState();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    if (!currentUser.preferenceInfoId) {
      history.push(PATHS.PREFERENCES);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser && getCookie('buffettTest500')) return;

    setCookie('buffettTest500', currentUser?.uid || uuid(), 7);
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchStaticPortfolio = async () => {
      const staticPortfolioResponse = await requestPortfolio(currentUser.uid);
      onStaticPortfolioFetched(staticPortfolioResponse.portfolio);
    };

    fetchStaticPortfolio();
  }, [currentUser]);

  return (
    <>
      <Header
        currentUser={currentUser}
        onLoginClick={loginButtonClickHandler}
        onLogoutClick={onLogout}
      />
      {
        isAuthModalOpen
        && <LoginModal
          setIsModalOpen={setIsAuthModalOpen}
          onLogin={onLogin}
        />
      }
      <Switch>
        <Route path={PATHS.ROOT} exact>
          <Main setIsModalOpen={setIsAuthModalOpen} />
        </Route>
        {
          currentUser
          && <Route path='/users/:user_uid/portfolios/:portfolio_owner_uid'>
            <PortfolioPage
              currentUser={currentUser}
              currentUserStaticPortfolio={staticPortfolio}
              onStaticPortfolioFetched={onStaticPortfolioFetched}
            />
          </Route>
        }
        {
          currentUser
          && <Route path={PATHS.PREFERENCES}>
            <PreferencesForm
              currentUser={currentUser}
              onUserUpdate={onUserUpdate}
              onPreferenceInfoUpdate={onPreferenceInfoUpdate}
            />
          </Route>
        }
        <Route path={`${PATHS.STOCK_DETAILS}${PATHS.KEYWORD}`}>
          <StockDetails />
        </Route>
      </Switch>
    </>
  );
};

const mapStateToProps = state => {
  return {
    currentUser: state.user.currentUser,
    staticPortfolio: state.user.staticPortfolio,
    recommendationCriterion: state.user.recommendationCriterion,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onInitialStatesFetched: (user, preferenceInfo) => {
      dispatch(setCurrentUser(user));
      if (!preferenceInfo) return;
      dispatch(setPreferenceInfo(preferenceInfo));
    },
    onLogin: user => dispatch(setCurrentUser(user)),
    onLogout: () => dispatch(initializeUserStates()),
    onUserUpdate: user => dispatch(setCurrentUser(user)),
    onPreferenceInfoUpdate: preferenceInfo => dispatch(setPreferenceInfo(preferenceInfo)),
    onStaticPortfolioFetched: portfolio => dispatch(setStaticPortfolio(portfolio)),
    setRecommendationCriterion: criterion => dispatch(setRecommendationCriterion(criterion)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
