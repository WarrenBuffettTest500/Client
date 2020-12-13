import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import SearchInput from '../../atoms/SearchInput';
import { useToasts } from 'react-toast-notifications';
import requestSymbolList from '../../../api/requestSymbolList';

import {
  getSuggestions,
  getSuggestionValue,
  renderSuggestion,
} from '../../../utils/autosuggest';
import PATHS from '../../../constants/paths';
import RESPONSES from '../../../constants/responses';

const SearchBar = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [symbols, setSymbols] = useState(null);
  const { addToast } = useToasts();
  const history = useHistory();

  const onChange = async (event, { newValue, method }) => {
    if (!symbols) {
      const { result, symbolList } = await requestSymbolList();

      if (result === RESPONSES.OK) {
        setSymbols(symbolList);

        return;
      }
      if (result === RESPONSES.FAILURE) {
        addToast('데이터가 없습니다', {
          appearance: 'error',
          autoDismiss: true,
        });

        return;
      }
    }

    setSearchKeyword(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    if (!symbols) return;

    setSuggestions(getSuggestions(value, symbols));
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
    symbols,
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
        renderInputComponent={SearchInput}
      />
    </>
  );
};

export default SearchBar;
