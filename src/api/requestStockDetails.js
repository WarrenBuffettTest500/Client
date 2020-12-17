import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestStockDetails = async (keyword, interval = '1day') => {
  try {
    const response = await fetch(`${PATHS.HOST}${PATHS.SERVER_PORT}${PATHS.STOCK_DETAILS}/${keyword}/${interval}`, {
      method: METHODS.GET,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { result, stockDetails: data } = await response.json();
    const stockDetails = JSON.parse(data);

    return { result, stockDetails };
  } catch (error) {
    alert(error.message);
  }
};

export default requestStockDetails;
