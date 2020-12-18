import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import SearchInput from '../../atoms/SearchInput';
import requestSymbolList from '../../../api/requestSymbolList';
import {
  getSuggestions,
  getSuggestionValue,
  renderSuggestion,
} from '../../../utils/autosuggest';
import { useToasts } from 'react-toast-notifications';
import TOAST_APPEARANCES from '../../../constants/toastAppearances';
import PATHS from '../../../constants/paths';
import { RESPONSE_RESULTS } from '../../../constants/responses';

const SearchBar = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [symbols, setSymbols] = useState(null);
  const { addToast } = useToasts();
  const history = useHistory();

  const getSymbolList = async () => {
    if (!symbols) {
      const { result, symbolList } = await requestSymbolList();

      if (result === RESPONSE_RESULTS.FAILURE) {
        addToast('데이터가 없습니다', {
          appearance: TOAST_APPEARANCES.WARNING,
          autoDismiss: true,
        });

        return;
      }

      setSymbols(symbolList);
    }
  };

  useEffect(getSymbolList, []);

  const onChange = (event, { newValue, method }) => {
    setSearchKeyword(newValue.toUpperCase());
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
      addToast('주식 정보가 없습니다', {
        appearance: TOAST_APPEARANCES.WARNING,
        autoDismiss: true,
      });

      return;
    }

    history.push(`${PATHS.STOCK_DETAILS}/${searchKeyword}`);
  };

  const inputProps = {
    placeholder: 'S&P500 기업을 티커로 검색해 보세요',
    value: searchKeyword,
    symbols,
    onChange,
    onKeyPress: keyPressHandler,
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
      renderInputComponent={SearchInput}
    />
  );
};

export default SearchBar;
