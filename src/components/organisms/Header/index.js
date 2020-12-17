import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import SearchBar from '../../molecules/SearchBar';
import Button from '../../atoms/Button';
import Modal from '../../atoms/Modal';
import PATHS from '../../../constants/paths';

const Header = ({
  currentUser,
  onLoginClick,
  onLogoutClick,
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

  const preferencesButtonClickHandler = () => {
    history.push(PATHS.PREFERENCES);
    setIsUserModalOpen(false);
  };

  return (
    <header className='header_items_wrapper'>
      <div className='header_item'>
        <div
          className='logo'
          onClick={homeButtonClickHandler}
        >
          <h2>Warren Buffett Test 500</h2>
        </div>
      </div>
      <div className='header_item'>
        <SearchBar />
      </div>
      <div className='header_item'>
        {
          currentUser
            ? <Button
              className='profile_button'
              onClick={profileButtonClickHandler}>
              <img
                className='profile_img'
                src={currentUser.photoURL} />
            </Button>
            : <Button
              className='login_button'
              text='로그인'
              onClick={onLoginClick}
            />
        }
      </div>
      {
        isUserModalOpen
        && <Modal
          className='user_modal'
        >
          <Button
            className='preferences_button'
            text='투자성향 설정'
            onClick={preferencesButtonClickHandler}
          />
          <Button
            className='logout_button'
            text='로그아웃'
            onClick={onLogoutClick}
          />
        </Modal>
      }
    </header>
  );
};

export default Header;
