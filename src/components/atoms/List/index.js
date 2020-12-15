import React from 'react';

const List = ({
  title,
  children,
  titleWrapperClassName,
  childrenWrapperClassName,
}) => {
  return (
    <>
      {
        title
        && <div className={titleWrapperClassName}>
          <h3>{title}</h3>
        </div>
      }
      <div className={childrenWrapperClassName}>
        {children}
      </div>
    </>
  );
};

export default List;
