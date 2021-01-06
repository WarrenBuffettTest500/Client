import React from 'react';
import { useHistory } from 'react-router-dom';
import PATHS from '../../../constants/paths';
import { authService, provider } from '../../../config/firebase';
import requestUserSignIn from '../../../api/requestUserSignIn';
import { useToasts } from 'react-toast-notifications';
import TOAST_APPEARANCES from '../../../constants/toastAppearances';
import { RESPONSE_RESULTS, RESPONSE_MESSAGES } from '../../../constants/responses';
import Modal from '../../atoms/Modal';
import ModalOverlay from '../../atoms/ModalOverlay';
import GoogleAuthButton from '../GoogleAuthButton';

const LoginModal = ({
  setIsModalOpen,
  onLogin,
}) => {
  const { addToast } = useToasts();
  const history = useHistory();

  const googleAuthClickHandler = async authType => {
    const { user } = await authService.signInWithPopup(provider);
    const userInfo = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };

    if (authType === 'login') {
      try {
        const { result, user, token } = await requestUserSignIn(userInfo, PATHS.LOGIN);

        if (result === RESPONSE_RESULTS.FAILURE) {
          addToast('회원가입을 해주세요', {
            appearance: TOAST_APPEARANCES.INFO,
            autoDismiss: true,
          });

          return;
        }

        localStorage.setItem('token', token);
        onLogin(user);
        setIsModalOpen(false);
        addToast('성공적으로 로그인했습니다', {
          appearance: TOAST_APPEARANCES.SUCCESS,
          autoDismiss: true,
        });
      } catch (error) {
        addToast(error.message, {
          appearance: TOAST_APPEARANCES.ERROR,
          autoDismiss: true,
        });
      }
    } else {
      try {
        const { result, user, token, message } = await requestUserSignIn(userInfo, PATHS.SIGNUP);

        localStorage.setItem('token', token);
        onLogin(user);
        setIsModalOpen(false);

        if (message === RESPONSE_MESSAGES.ALREADY_SIGNED_UP) {
          addToast('이미 회원가입했습니다. 로그인합니다.', {
            appearance: TOAST_APPEARANCES.INFO,
            autoDismiss: true,
          });
        } else if (result === RESPONSE_RESULTS.OK) {
          addToast('회원가입에 성공했습니다', {
            appearance: TOAST_APPEARANCES.INFO,
            autoDismiss: true,
          });
        }

        history.push(PATHS.PREFERENCES);
      } catch (error) {
        addToast(error.message, {
          appearance: TOAST_APPEARANCES.ERROR,
          autoDismiss: true,
        });
      }
    }
  };

  return (
    <>
      <ModalOverlay setIsModalOpen={setIsModalOpen} />
      <Modal className='auth_modal'>
        <GoogleAuthButton
          authType='login'
          onClick={() => googleAuthClickHandler('login')}
        />
        <GoogleAuthButton
          authType='signup'
          onClick={() => googleAuthClickHandler('signup')}
        />
      </Modal>
    </>
  );
};

export default LoginModal;
