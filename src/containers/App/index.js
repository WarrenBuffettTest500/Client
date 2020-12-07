import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Header from '../../components/organisms/Header';
import { setStockDetails } from '../../store/stock';
import { setCurrentUser, removeCurrentUser, setPreferenceInfo } from '../../store/user';
import LoginModal from '../../components/molecules/LoginModal/';
import PreferencesForm from '../../components/templates/PreferencesForm';
import { Switch, Route } from 'react-router-dom';
import PATHS from '../../constants/paths';

const App = ({
  onLogin,
  onLogout,
  currentUser,
  setStockDetails,
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
        onSearchBarKeyPress={setStockDetails}
      />
      <LoginModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onLogin={onLogin}
      />
      <Switch>
        <Route path={PATHS.PREFERENCES}>
        <PreferencesForm
          currentUser={currentUser}
          onUserUpdate={onUserUpdate}
          onPreferenceInfoUpdate={onPreferenceInfoUpdate}
        />
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
    onLogin: user => dispatch(setCurrentUser(user)),
    onLogout: () => dispatch(removeCurrentUser()),
    onUserUpdate: user => dispatch(setCurrentUser(user)),
    onPreferenceInfoUpdate: preferenceInfo => dispatch(setPreferenceInfo(preferenceInfo)),
    setStockDetails: stockDetails => dispatch(setStockDetails(stockDetails)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
