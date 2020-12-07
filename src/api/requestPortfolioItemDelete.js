import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestPortfolioItemDelete = async (user, portfolioItemId) => {
  const response = await fetch(
    `${PATHS.HOST}${PATHS.SERVER_PORT}${PATHS.USERS}/${user.uid}/portfolio_items/${portfolioItemId}`,
    {
      method: METHODS.DELETE,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return await response.json();
};

export default requestPortfolioItemDelete;
