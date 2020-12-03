import React from 'react';

const Button = ({ onClick, name }) => {

  const onHandleClick = () => {
    onClick();
  };

  return (
    <div
      onClick={onHandleClick}>{name}
    </div>
  );
};

export default Button;
