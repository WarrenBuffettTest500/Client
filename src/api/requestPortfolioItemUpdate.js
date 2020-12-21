import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestPortfolioItemUpdate = async (userUid, data, portfolioItemId) => {
  const response = await fetch(
    `${PATHS.HOST}${PATHS.SERVER_PORT}${PATHS.USERS}/${userUid}/portfolio_items/${portfolioItemId}`, {
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
