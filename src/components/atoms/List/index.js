import React from 'react';
import styles from './index.module.scss';

const List = ({
  title,
  children,
  className,
  ...attributes
}) => {
  return (
    <div
      className={styles[className]}
      {...attributes}
    >
      {
        title
        && <div>
          <h3>{title}</h3>
        </div>
      }
      <div>
        <h4>{children}</h4>
      </div>
    </div>
  );
};

export default List;
