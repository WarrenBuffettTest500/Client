import React from 'react';
import Input from '../../atoms/Input';

const FormInputField = ({
  type,
  title,
  options,
  ...attributes
}) => {
  return (
    <div>
      <li>{title}</li>
      {
        options.map(option => {
          return (
            <div key={Object.keys(option)[0]}>
              <Input
                type={type}
                value={Object.keys(option)[0]}
                {...attributes}
              />
              <label>{` ${option[Object.keys(option)[0]]}`}</label>
              <br />
            </div>
          );
        })
      }
    </div>
  );
};

export default FormInputField;
