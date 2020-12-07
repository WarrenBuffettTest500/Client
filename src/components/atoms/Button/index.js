import React from 'react';
import styles from './index.module.scss';

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
      className={styles[className]}
      onClick={onClick}
      name={text}
      {...attributes}
    >
      {text}
      {children}
      <img src={imgSrc} />
    </button>
  );
};

export default Button;
