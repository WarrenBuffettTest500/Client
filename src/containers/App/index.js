import React from 'react';
import { connect } from 'react-redux';
import { onLogin } from '../../store/user';
import Header from '../../components/organisms/Header';

const App = ({ onLogin }) => {
  return (
    <>
      <Header onLoginClick={onLogin} />
    </>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onLogin: user => dispatch(onLogin(user)),
  };
};

export default connect(null, mapDispatchToProps)(App);
