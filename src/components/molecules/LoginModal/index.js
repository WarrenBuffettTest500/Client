import React from 'react';
import Modal from 'react-modal';
import { useHistory } from 'react-router-dom';
import Button from '../../atoms/Button';
import PATHS from '../../../constants/paths';
import AUTH from '../../../constants/auth';
import { authService, provider } from '../../../config/firebase';
import requestSignIn from '../../../api/requestSignin';
import { useToasts } from 'react-toast-notifications';

const LoginModal = ({
  isModalOpen,
  setIsModalOpen,
  onLogin,
  onSignup,
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

    if (event.target.className === 'login with google') {
      try {
        const { data: { message, token } } = await requestSignIn(userInfo, PATHS.LOGIN);

        if (message === '이미 가입했어요') {
          localStorage.setItem(AUTH.GOOGIT_LOGIN_TOKEN, token);
          onLogin(...userInfo);
          setIsModalOpen(false);

          addToast(message, {
            appearance: 'success',
            autoDismiss: true,
          });
        } else {
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
        const { data: { message, token } } = await requestSignIn(userInfo, PATHS.SIGNUP);

        if (message === '이미 가입했어요') {
          localStorage.setItem(AUTH.GOOGIT_LOGIN_TOKEN, token);
          onLogin(...userInfo);
          setIsModalOpen(false);
          addToast(message, {
            appearance: 'success',
            autoDismiss: true,
          });
        } else {
          onSignup({ ...userInfo });
          history.push(PATHS.SIGNUP);
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
