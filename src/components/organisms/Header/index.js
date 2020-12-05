import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import SearchBar from '../../molecules/SearchBar';
import Button from '../../atoms/Button';
import Modal from '../../molecules/Modal';
import './index.scss';

const Header = ({
  currentUser,
  onLoginClick,
  onLogoutClick,
  onSearchBarKeyPress,
}) => {
  const { pathname } = useLocation();
  const history = useHistory();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const homeButtonClickHandler = () => {
    if (pathname === '/') {
      window.location.reload();
    } else {
      history.push('/');
    }
  };

  const profileButtonClickHandler = () => {
    setIsUserModalOpen(!isUserModalOpen);
  };

  return (
    <header className='wrapper'>
      <div
        className='home'
        onClick={homeButtonClickHandler}
      >
        <h2>버핏테스트500</h2>
      </div>
      <SearchBar
        onSearchBarKeyPress={onSearchBarKeyPress}
      />
      {
        currentUser
          ? <Button
            className='profileButton'
            onClick={profileButtonClickHandler}
          />
          : <Button
            className='loginButton'
            text='로그인'
            onClick={onLoginClick}
          />
      }
      {
        isUserModalOpen
        && <Modal
          className='userModal'
        >
          <Button
            className='preferencesButton'
            text='투자성향 설정'
          />
          <Button
            className='logoutButton'
            text='로그아웃'
            onClick={onLogoutClick}
          />
        </Modal>
      }
    </header>
  );
};

export default Header;
