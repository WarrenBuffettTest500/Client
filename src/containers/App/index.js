import React, { useState } from 'react';
import { connect } from 'react-redux';
import Header from '../../components/organisms/Header';
import { onLogin, onSignup } from '../../store/user';
import LoginModal from '../../components/molecules/LoginModal/';

const App = ({
  onLogin,
  onSignup,
  token,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const loginButtonClickHandler = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Header onLoginClick={loginButtonClickHandler} />
      <LoginModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onLogin={onLogin}
        onSignup={onSignup}
      />
    </>
  );
};

const mapStateToProps = state => {
  return {
    token: state.user.token,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogin: user => dispatch(onLogin(user)),
    onSignup: user => dispatch(onSignup(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
