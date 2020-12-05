import React, { useState } from 'react';
import { connect } from 'react-redux';
import Header from '../../components/organisms/Header';
import { onLogin, onLogout } from '../../store/user';
import { setStockDetails } from '../../store/stock';
import LoginModal from '../../components/molecules/LoginModal/';

const App = ({
  onLogin,
  onLogout,
  currentUser,
  setStockDetails,
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
    setStockDetails: stockDetails => dispatch(setStockDetails(stockDetails)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
