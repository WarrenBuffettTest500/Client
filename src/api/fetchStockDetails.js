import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const fetchStockDetails = async (keyword, interval = '1day') => {
  const host
    = process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_LOCALHOST
      : process.env.REACT_APP_PROD_SERVER_HOST;

  const response = await fetch(
    `${host}${PATHS.STOCK_DETAILS}/${keyword}/${interval}`, {
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
