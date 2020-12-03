import React from 'react';

const Button = ({ onClick, text }) => {
  const clickHandler = event => {
    onClick(event);
  };

  return (
    <button
      className={text}
      onClick={clickHandler}
    >
      {text}
    </button>
  );
};

export default Button;
