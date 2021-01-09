import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestPortfolioItemDelete = async (userUid, portfolioItemId) => {
  const serverRoot
    = process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_SERVER_LOCALHOST
      : process.env.REACT_APP_PROD_SERVER_ROOT;

  const response = await fetch(
    `${serverRoot}${PATHS.USERS}/${userUid}/portfolio_items/${portfolioItemId}`, {
    method: METHODS.DELETE,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return await response.json();
};

export default requestPortfolioItemDelete;
