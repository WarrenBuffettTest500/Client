import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestSymbolList = async () => {
  const response = await fetch(
    `${PATHS.HOST}${PATHS.SERVER_PORT}${PATHS.COMPANY_PROFILES}${PATHS.SYMBOL}`, {
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
