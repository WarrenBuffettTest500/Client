import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestPortfolioItemUpdate = async (userUid, data, portfolioItemId) => {
  const host
    = process.env === 'development'
      ? process.env.REACT_APP_LOCALHOST
      : process.env.REACT_APP_PROD_SERVER_HOST;

  const response = await fetch(
    `${host}${PATHS.SERVER_PORT}${PATHS.USERS}/${userUid}/portfolio_items/${portfolioItemId}`, {
    method: METHODS.PUT,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });

  return await response.json();
};

export default requestPortfolioItemUpdate;
