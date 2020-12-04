import React, { useState } from 'react';
import { connect } from 'react-redux';
import { onLogin, onSignup } from '../../store/user';
import Button from '../../components/atoms/Button/';
import LoginModal from '../../components/molecules/LoginModal/';

const App = ({
  onLogin,
  onSignup,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const clickHandler = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Button
        onClick={clickHandler}
        text='login' />
      <LoginModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onLogin={onLogin}
        onSignup={onSignup}
      />
    </>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onLogin: user => dispatch(onLogin(user)),
    onSignup: user => dispatch(onSignup(user)),
  };
};

export default connect(null, mapDispatchToProps)(App);
