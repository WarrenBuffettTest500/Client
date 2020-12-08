import React from 'react';

const Button = ({
  className,
  onClick,
  text,
  imgSrc,
  children,
  ...attributes
}) => {
  return (
    <button
      type='button'
      className={className}
      onClick={onClick}
      name={text}
      {...attributes}
    >
      <img
        src={imgSrc}
        className={className}
        />
      {text}
      {children}
    </button>
  );
};

export default Button;
