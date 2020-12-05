import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Header from '../../components/organisms/Header';
import { setCurrentUser, removeCurrentUser, setPreferenceInfo } from '../../store/user';
import LoginModal from '../../components/molecules/LoginModal/';
import PreferencesForm from '../../components/templates/PreferencesForm';

const App = ({
  onLogin,
  onLogout,
  currentUser,
  onUserUpdate,
  onPreferenceInfoUpdate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const loginButtonClickHandler = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Header
        currentUser={currentUser}
        onLoginClick={loginButtonClickHandler}
        onLogoutClick={onLogout}
      />
      <LoginModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onLogin={onLogin}
      />
      <PreferencesForm
        currentUser={currentUser}
        onUserUpdate={onUserUpdate}
        onPreferenceInfoUpdate={onPreferenceInfoUpdate}
      />
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
    onLogin: user => dispatch(setCurrentUser(user)),
    onLogout: () => dispatch(removeCurrentUser()),
    onUserUpdate: user => dispatch(setCurrentUser(user)),
    onPreferenceInfoUpdate: preferenceInfo => dispatch(setPreferenceInfo(preferenceInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
