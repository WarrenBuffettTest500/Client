import React from 'react';

const List = ({
  title,
  children,
  titleWrapperClassName,
  childrenWrapperClassName,
}) => {
  return (
    <div>
      {
        title
        && <div className={titleWrapperClassName}>
          <h3>{title}</h3>
        </div>
      }
      <div className={childrenWrapperClassName}>
        {children}
      </div>
    </div>
  );
};

export default List;
