import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestPortfolioItemDelete = async (userUid, portfolioItemId) => {
  const response = await fetch(`${PATHS.HOST}${PATHS.SERVER_PORT}${PATHS.USERS}/${userUid}/portfolio_items/${portfolioItemId}`, {
    method: METHODS.DELETE,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
};

export default requestPortfolioItemDelete;
