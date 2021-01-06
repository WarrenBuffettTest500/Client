import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestPortfolioItemCreate = async (userUid, data) => {
  const serverRoot
    = process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_LOCALHOST
      : process.env.REACT_APP_PROD_SERVER_ROOT;

  const response = await fetch(
    `${serverRoot}${PATHS.USERS}/${userUid}/portfolio_items`, {
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
