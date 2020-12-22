import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const fetchStockDetails = async (keyword, interval = '1day') => {
  const response = await fetch(
    `${PATHS.HOST}${PATHS.SERVER_PORT}${PATHS.STOCK_DETAILS}/${keyword}/${interval}`, {
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
