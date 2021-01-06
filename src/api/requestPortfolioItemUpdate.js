import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestPortfolioItemUpdate = async (userUid, data, portfolioItemId) => {
  const serverRoot
    = process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_LOCALHOST
      : process.env.REACT_APP_PROD_SERVER_ROOT;

  const response = await fetch(
    `${serverRoot}${PATHS.USERS}/${userUid}/portfolio_items/${portfolioItemId}`, {
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
