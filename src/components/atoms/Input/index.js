import React from 'react';

const Input = ({
  className,
  ...attributes
}) => {
  return (
    <input className={className}
      {...attributes}
    >
    </input>
  );
};

export default Input;
