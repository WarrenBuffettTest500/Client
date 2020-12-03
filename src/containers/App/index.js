import React from 'react';
import { connect } from 'react-redux';
import { onLogin, onLogout } from '../../store/user';
import Button from '../../components/atoms/Button/';

const App = ({ onLogin }) => {
  return (
    <Button onClick={onLogin}></Button>
  );  
};

const mapDispatchToProps = dispatch => {
  return {
    onLogin : user => dispatch(onLogin(user)),
  };
};

export default connect(null, mapDispatchToProps)(App);
