import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const fetchStockDetails = async (keyword, interval = '1day') => {
  const serverRoot
    = process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_LOCALHOST
      : process.env.REACT_APP_PROD_SERVER_ROOT;

  const response = await fetch(
    `${serverRoot}${PATHS.STOCK_DETAILS}/${keyword}/${interval}`, {
    method: METHODS.GET,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const { result, stockDetails: data } = await response.json();
  const stockDetails = JSON.parse(data);

  return { result, stockDetails };
};

export default fetchStockDetails;
