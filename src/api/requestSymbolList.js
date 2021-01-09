import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestSymbolList = async () => {
  const serverRoot
    = process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_SERVER_LOCALHOST
      : process.env.REACT_APP_PROD_SERVER_ROOT;

  const response = await fetch(
    `${serverRoot}${PATHS.COMPANY_PROFILES}${PATHS.SYMBOL}`, {
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
