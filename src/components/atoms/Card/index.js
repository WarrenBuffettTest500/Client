import React from 'react';

const Card = ({
  className,
  children,
  ...attributes
}) => {
  return (
    <div
      className={className}
      {...attributes}
    >
      {children}
    </div>
  );
};

export default Card;
