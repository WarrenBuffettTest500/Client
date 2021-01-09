import METHODS from '../constants/methods';

const requestTrendingStocks = async () => {
  const serverRoot
    = process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_SERVER_LOCALHOST
      : process.env.REACT_APP_PROD_SERVER_ROOT;

  const response = await fetch(
    `${serverRoot}/hits/trending`, {
    method: METHODS.GET,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
};

export default requestTrendingStocks;
