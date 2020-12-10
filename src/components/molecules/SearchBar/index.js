import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import Input from '../../atoms/Input';
import { useToasts } from 'react-toast-notifications';
import { symbols } from '../../../mock_data/symbols';
import requestStockDetails from '../../../api/requestStockDetails';
import requestRecommendationSymbolList from '../../../api/requestRecommendationSymbolList';
import {
  getSuggestions,
  getSuggestionValue,
  renderSuggestion,
} from '../../../utils/autosuggest';
import PATHS from '../../../constants/paths';
import RESPONSES from '../../../constants/responses';
import { setRecommendationSymbolList, setRecommendationSymbolInfo } from '../../../store/stock';

const SearchBar = ({ onSearchBarKeyPress }) => {
  const dispatch = useDispatch();
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
      const { result, stockDetails } = await requestStockDetails(searchKeyword);

      if (result === RESPONSES.OK) {
        onSearchBarKeyPress(stockDetails);

        const { result, recommendationSymbolList, recommendationSymbolInfo } = await requestRecommendationSymbolList(searchKeyword);

        if (result === RESPONSES.OK) {
          dispatch(setRecommendationSymbolList(recommendationSymbolList));
          dispatch(setRecommendationSymbolInfo(recommendationSymbolInfo));
        }

        if (result === RESPONSES.FAILURE) {
          alert('리스트를 가져오지 못했습니다');
        }

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
