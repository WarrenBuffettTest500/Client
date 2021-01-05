import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestTrendingStocks = async () => {
  const host
    = process.env === 'development'
      ? process.env.REACT_APP_LOCALHOST
      : process.env.REACT_APP_PROD_SERVER_HOST;

  const response = await fetch(
    `${host}${PATHS.SERVER_PORT}/hits/trending`, {
    method: METHODS.GET,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
};

export default requestTrendingStocks;
