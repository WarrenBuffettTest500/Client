import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestSymbolList = async () => {
  const host
    = process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_LOCALHOST
      : process.env.REACT_APP_PROD_SERVER_HOST;

  const response = await fetch(
    `${host}${PATHS.SERVER_PORT}${PATHS.COMPANY_PROFILES}${PATHS.SYMBOL}`, {
    method: METHODS.GET,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const { result, data } = await response.json();
  const symbolList = data.map(item => item.symbol);

  return { result, symbolList };
};

export default requestSymbolList;
