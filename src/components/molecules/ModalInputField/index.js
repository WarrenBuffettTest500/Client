import React from 'react';
import Input from '../../atoms/Input';

const ModalInputField = ({ title, value, className, ...attributes }) => {
  return (
    <div className={className}>
      <h3>{title}</h3>
      <Input
        type='text'
        value={value}
        {...attributes}
      />
    </div>
  );
};

export default ModalInputField;
