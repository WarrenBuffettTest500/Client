import React, { useState } from 'react';
import { connect } from 'react-redux';
import Header from '../../components/organisms/Header';
import { onLogin, onLogout } from '../../store/user';
import LoginModal from '../../components/molecules/LoginModal/';

const App = ({
  onLogin,
  onLogout,
  currentUser,
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
    onLogin: user => dispatch(onLogin(user)),
    onLogout: () => dispatch(onLogout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
