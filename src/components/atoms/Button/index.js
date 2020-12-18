import React from 'react';

const Button = ({
  className,
  onClick,
  text,
  imgSrc,
  alt,
  imgClassName,
  textClassName,
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
      {
        imgSrc
        && <img
          className={imgClassName}
          src={imgSrc}
          alt={alt}
        />
      }
      <span className={textClassName}>{text}</span>
      {children}
    </button>
  );
};

export default Button;
