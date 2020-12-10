import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import Input from '../../atoms/Input';
import { useToasts } from 'react-toast-notifications';
import { symbols } from '../../../mock_data/symbols';

import {
  getSuggestions,
  getSuggestionValue,
  renderSuggestion,
} from '../../../utils/autosuggest';
import PATHS from '../../../constants/paths';

const SearchBar = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { addToast } = useToasts();
  const history = useHistory();

  const onChange = (event, { newValue, method }) => {
    setSearchKeyword(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const keyPressHandler = async event => {
    if (event.key !== 'Enter' || !searchKeyword) return;
    if (!symbols.includes(searchKeyword)) {
      addToast('정보가 없는 주식입니다', {
        appearance: 'info',
        autoDismiss: true,
      });
    } else {
        history.push(`${PATHS.STOCK_DETAILS}/${searchKeyword}`);
        return;
    }
  };

  const inputProps = {
    placeholder: '관심있는 주식을 검색하세요',
    value: searchKeyword,
    onChange,
    onKeyPress: keyPressHandler,
  };

  return (
    <>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        renderInputComponent={Input}
      />
    </>
  );
};

export default SearchBar;
