import React from 'react';
import SearchIcon from '@material-ui/icons/Search';

const SearchInput = inputProps => (
  <div className='input_container'>
    <SearchIcon className='icon' />
    <input
      {...inputProps} />
  </div>
);

export default SearchInput;
