import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const fetchPortfolio = async portfolioOwnerUid => {
  const serverRoot
    = process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_SERVER_LOCALHOST
      : process.env.REACT_APP_PROD_SERVER_ROOT;

  const portfolioResponse = await fetch(
    `${serverRoot}${PATHS.USERS}/${portfolioOwnerUid}/portfolio`, {
    method: METHODS.GET,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return portfolioResponse.json();
};

export default fetchPortfolio;
