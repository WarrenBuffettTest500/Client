import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '../../atoms/Button';
import PATHS from '../../../constants/paths';
import { authService, provider } from '../../../config/firebase';
import requestSignIn from '../../../api/requestSignIn';
import { useToasts } from 'react-toast-notifications';
import TOAST_APPEARANCES from '../../../constants/toastAppearances';
import { RESPONSE_RESULTS } from '../../../constants/responses';
import Modal from '../../atoms/Modal';
import ModalOverlay from '../../atoms/ModalOverlay';

const LoginModal = ({
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
        const { result, user, token } = await requestSignIn(userInfo, PATHS.SIGNUP);

        if (result === RESPONSE_RESULTS.FAILURE) {
          localStorage.setItem('token', token);
          onLogin(user);
          setIsModalOpen(false);
          addToast('이미 회원가입했습니다', {
            appearance: TOAST_APPEARANCES.INFO,
            autoDismiss: true,
          });

          return;
        }

        localStorage.setItem('token', token);
        onLogin(user);
        setIsModalOpen(false);
        addToast('회원가입에 성공했습니다', {
          appearance: TOAST_APPEARANCES.INFO,
          autoDismiss: true,
        });

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
        <Button
          onClick={googleAuthClickHandler}
          text='login with google'
        />
        <Button
          onClick={googleAuthClickHandler}
          text='signup with google'
        />
      </Modal>
    </>
  );
};

export default LoginModal;
