import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestPortfolioItemCreate = async (userUid, data) => {
  const host
    = process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_LOCALHOST
      : process.env.REACT_APP_PROD_SERVER_HOST;

  const response = await fetch(
    `${host}${PATHS.SERVER_PORT}${PATHS.USERS}/${userUid}/portfolio_items`, {
    method: METHODS.POST,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export default requestPortfolioItemCreate;
