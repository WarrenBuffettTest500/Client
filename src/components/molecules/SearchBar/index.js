import React, { useState } from 'react';
import './index.scss';
import SearchIcon from '@material-ui/icons/Search';

const SearchBar = () => {
  const [searchKeyword, setSearchKeyword] = useState('');

  return (
    <div className='searchBarWrapper'>
      <input
        className='searchBar'
        value={searchKeyword}
        onChange={event => setSearchKeyword(event.target.value)}
      />
      <SearchIcon className='searchIcon' />
    </div>
  );
};

export default SearchBar;
