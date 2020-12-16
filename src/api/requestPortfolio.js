import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestPortfolio = async portfolioOwnerUid => {
  const portfolioResponse = await fetch(`${PATHS.HOST}${PATHS.SERVER_PORT}${PATHS.USERS}/${portfolioOwnerUid}/portfolio`, {
    method: METHODS.GET,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return portfolioResponse.json();
};

export default requestPortfolio;
