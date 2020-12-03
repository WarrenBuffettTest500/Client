import React, { useState } from 'react';
import { connect } from 'react-redux';
import { onLogin, onSignup } from '../../store/user';
import Button from '../../components/atoms/Button/';
import LoginModal from '../../components/molecules/LoginModal/';

const App = ({
  onLogin,
  onSignup,
  token,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const clickHandler = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Button
        onClick={clickHandler}
        text={token ? 'logout' : 'login'} />
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
