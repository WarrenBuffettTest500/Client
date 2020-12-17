import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestTrendingStocks = async () => {
  const response = await fetch(
    `${PATHS.HOST}${PATHS.SERVER_PORT}/hits/trending`, {
    method: METHODS.GET,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
};

export default requestTrendingStocks;
