import React from 'react';
import SearchIcon from '@material-ui/icons/Search';

const Input = inputProps => (
  <div className='input_container'>
    <SearchIcon className='icon' />
    <input
      {...inputProps} />
  </div>
);

export default Input;
