import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './index.scss';
import SearchIcon from '@material-ui/icons/Search';
import Autosuggest from 'react-autosuggest';
import Input from '../../atoms/Input';
import { useToasts } from 'react-toast-notifications';
import { tickers } from '../../../mock_data/tickers';
import requestStockDetails from '../../../api/requestStockDetails';
import {
  getSuggestions,
  getSuggestionValue,
  renderSuggestion,
} from '../../../utils/autosuggest';
import PATHS from '../../../constants/paths';
import RESPONSES from '../../../constants/responses';
//todo: tickers mockdata -> db에서 조회
const SearchBar = ({ onSearchBarKeyPress }) => {
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
    if (!tickers.includes(searchKeyword)) {
      addToast('정보가 없는 주식입니다', {
        appearance: 'info',
        autoDismiss: true,
      });
    } else {
      const { result, stockDetails } = await requestStockDetails(searchKeyword);

      if (result === RESPONSES.OK) {
        onSearchBarKeyPress(stockDetails);
        history.push(`${PATHS.STOCK_DETAILS}/${searchKeyword}`);
        return;
      }
      if (result === RESPONSES.FAILURE) {
        history.push(PATHS.FAILURE);
        return;
      }
    }
  };

  const inputProps = {
    placeholder: '관심있는 주식을 검색하세요',
    value: searchKeyword,
    onChange,
    onKeyPress: keyPressHandler,
    className: 'searchBar',
  };

  return (
    <div className='searchBarWrapper'>
      <SearchIcon className='searchIcon' />
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        renderInputComponent={Input}
      />
    </div>
  );
};

export default SearchBar;
