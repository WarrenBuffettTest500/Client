import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Header from '../../components/organisms/Header';
import { setSearchStockDetails } from '../../store/stock';
import { setCurrentUser, removeCurrentUser, setPreferenceInfo, setStaticPortfolio } from '../../store/user';
import LoginModal from '../../components/molecules/LoginModal/';
import PreferencesForm from '../../components/templates/PreferencesForm';
import StockDetails from '../../pages/StockDetails';
import MyPage from '../../pages/MyPage';
import requestUser from '../../api/requestUser';
import requestPreferenceInfo from '../../api/requestPreferenceInfo';
import { Switch, Route } from 'react-router-dom';
import PATHS from '../../constants/paths';
import '../../sass/app.scss';
import Main from '../../pages/Main';
import requestPortfolio from '../../api/requestPortfolio';

const App = ({
  onInitialStatesFetched,
  onLogin,
  onLogout,
  currentUser,
  onUserUpdate,
  onPreferenceInfoUpdate,
  staticPortfolio,
  onStaticPortfolioFetched,
}) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const loginButtonClickHandler = () => {
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) return;

    const initializeUserState = async () => {
      const { user } = await requestUser();
      let preferenceInfoResponse;

      if (user.preferenceInfoId) {
        preferenceInfoResponse = await requestPreferenceInfo(user);
      }

      onInitialStatesFetched(user, preferenceInfoResponse?.preferenceInfo);
    };

    initializeUserState();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const fetchStaticPortfolio = async () => {
      const staticPortfolioResponse = await requestPortfolio(currentUser);

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
          <Main
            currentUser={currentUser}
            staticPortfolio={staticPortfolio}
          />
        </Route>
        {
          currentUser
          && <Route path={PATHS.MY_PAGE}>
            <MyPage
              currentUser={currentUser}
              staticPortfolio={staticPortfolio}
            />
          </Route>
        }
        <Route path={PATHS.PREFERENCES}>
          <PreferencesForm
            currentUser={currentUser}
            onUserUpdate={onUserUpdate}
            onPreferenceInfoUpdate={onPreferenceInfoUpdate}
          />
        </Route>
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
    onLogout: () => dispatch(removeCurrentUser()),
    onUserUpdate: user => dispatch(setCurrentUser(user)),
    onPreferenceInfoUpdate: preferenceInfo => dispatch(setPreferenceInfo(preferenceInfo)),
    onStaticPortfolioFetched: portfolio => dispatch(setStaticPortfolio(portfolio)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
