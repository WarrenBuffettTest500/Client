import React from 'react';
import styles from './index.module.scss';

const Modal = ({
  className,
  children,
  ...attributes
}) => {
  return (
    <div
      className={styles[className]}
      {...attributes}
    >
      {children}
    </div>
  );
};

export default Modal;
