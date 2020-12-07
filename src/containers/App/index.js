import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Header from '../../components/organisms/Header';
import { setStockDetails } from '../../store/stock';
import { setCurrentUser, removeCurrentUser, setPreferenceInfo } from '../../store/user';
import LoginModal from '../../components/molecules/LoginModal/';
import PreferencesForm from '../../components/templates/PreferencesForm';
import StockDetails from '../../pages/StockDetails';
import MyPage from '../../pages/MyPage';
import requestUser from '../../api/requestUser';
import requestPreferenceInfo from '../../api/requestPreferenceInfo';
import { Switch, Route } from 'react-router-dom';
import PATHS from '../../constants/paths';
import '../../sass/app.scss';

const App = ({
  onInitialStatesFetched,
  onLogin,
  onLogout,
  currentUser,
  setStockDetails,
  onUserUpdate,
  onPreferenceInfoUpdate,
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

      onInitialStatesFetched(user, preferenceInfoResponse.preferenceInfo);
    };

    initializeUserState();
  }, []);

  return (
    <>
      <Header
        currentUser={currentUser}
        onLoginClick={loginButtonClickHandler}
        onLogoutClick={onLogout}
        onSearchBarKeyPress={setStockDetails}
      />
      {
        isAuthModalOpen
        && <LoginModal
          setIsModalOpen={setIsAuthModalOpen}
          onLogin={onLogin}
        />
      }
      <MyPage currentUser={currentUser} />
      <Switch>
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
    currentUser: state.user.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onInitialStatesFetched: (user, preferenceInfo) => {
      dispatch(setCurrentUser(user));
      dispatch(setPreferenceInfo(preferenceInfo));
    },
    onLogin: user => dispatch(setCurrentUser(user)),
    onLogout: () => dispatch(removeCurrentUser()),
    onUserUpdate: user => dispatch(setCurrentUser(user)),
    onPreferenceInfoUpdate: preferenceInfo => dispatch(setPreferenceInfo(preferenceInfo)),
    setStockDetails: stockDetails => dispatch(setStockDetails(stockDetails)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
