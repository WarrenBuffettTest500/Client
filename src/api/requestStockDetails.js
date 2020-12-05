import METHOD from '../constants/method';
import PATHS from '../constants/paths';

const requestStockDetails = async keyword => {
  const response = await fetch(
    `${PATHS.HOST}${PATHS.SERVER_PORT}${PATHS.TICKERS}/${keyword}`,
    {
      method: METHOD.GET,
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    },
  );

  return response.json();
};

export default requestStockDetails;
