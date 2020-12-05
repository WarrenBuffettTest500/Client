import React from 'react';
import Modal from 'react-modal';
import { useHistory } from 'react-router-dom';
import Button from '../../atoms/Button';
import PATHS from '../../../constants/paths';
import { authService, provider } from '../../../config/firebase';
import requestSignIn from '../../../api/requestSignIn';
import { useToasts } from 'react-toast-notifications';
import RESPONSES from 'constants/responses';

const LoginModal = ({
  isModalOpen,
  setIsModalOpen,
  onLogin,
}) => {
  const { addToast } = useToasts();
  const history = useHistory();

  const googleAuthClickHandler = async event => {
    const { user } = await authService.signInWithPopup(provider);
    const userInfo = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };

    if (event.target.name === 'login with google') {
      try {
        const { result, user, token } = await requestSignIn(userInfo, PATHS.LOGIN);

        if (result === RESPONSES.OK) {
          localStorage.setItem('token', token);
          onLogin(user);
          setIsModalOpen(false);
          addToast('성공적으로 로그인했습니다', {
            appearance: 'success',
            autoDismiss: true,
          });
          return;
        }
        if (result === RESPONSES.FAILURE) {
          addToast('회원가입이 필요합니다', {
            appearance: 'info',
            autoDismiss: true,
          });
        }
      } catch (error) {
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    } else {
      try {
        const { result, user, token } = await requestSignIn(userInfo, PATHS.SIGNUP);

        if (result === RESPONSES.OK) {
          localStorage.setItem('token', token);
          onLogin(user);
          setIsModalOpen(false);
          addToast('회원가입에 성공하였습니다', {
            appearance: 'info',
            autoDismiss: true,
          });
          history.push(PATHS.PREFERENCES);
          return;
        }
        if (result === RESPONSES.FAILURE) {
          localStorage.setItem('token', token);
          onLogin(user);
          setIsModalOpen(false);
          addToast('이미 회원가입했습니다', {
            appearance: 'info',
            autoDismiss: true,
          });
          return;
        }
      } catch (error) {
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    }
  };

  return (
    <Modal isOpen={isModalOpen}>
      <Button
        onClick={googleAuthClickHandler}
        text='login with google'
      />
      <Button
        onClick={googleAuthClickHandler}
        text='signup with google'
      />
    </Modal>
  );
};

export default LoginModal;
