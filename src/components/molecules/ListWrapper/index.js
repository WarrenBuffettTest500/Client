import React from 'react';

const ListContainer = ({
  className,
  children
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default ListContainer;
