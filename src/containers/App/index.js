import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Header from '../../components/organisms/Header';
import { setStockDetails } from '../../store/stock';
import { setCurrentUser, removeCurrentUser, setPreferenceInfo } from '../../store/user';
import LoginModal from '../../components/molecules/LoginModal/';
import PreferencesForm from '../../components/templates/PreferencesForm';
import MyPage from '../../pages/MyPage';
import requestUser from '../../api/requestUser';
import requestPreferenceInfo from '../../api/requestPreferenceInfo';

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

      onInitialStatesFetched(user, preferenceInfoResponse?.preferenceInfo);
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
      {/* <PreferencesForm
        currentUser={currentUser}
        onUserUpdate={onUserUpdate}
        onPreferenceInfoUpdate={onPreferenceInfoUpdate}
      /> */}
      {
        currentUser
        && <MyPage currentUser={currentUser} />
      }
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
      if (!preferenceInfo) return;
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
