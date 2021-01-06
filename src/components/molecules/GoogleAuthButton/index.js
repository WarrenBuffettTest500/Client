import React from 'react';
import Button from '../../atoms/Button';

const GoogleAuthButton = ({
  authType,
  onClick,
}) => {
  const clickHandler = () => {
    onClick();
  };

  return (
    <Button
      className='google_auth_button'
      onClick={clickHandler}
      imgSrc='/images/G-logo.png'
      alt='Google logo'
      text={`${authType === 'login' ? 'Login' : 'Signup'} with Google`}
      textClassName='google_auth_text'
      imgClassName='google_icon'
    />
  );
};

export default GoogleAuthButton;
