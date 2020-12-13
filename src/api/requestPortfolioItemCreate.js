import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestPortfolioItemCreate = async (userUid, data) => {
  const response = await fetch(
    `${PATHS.HOST}${PATHS.SERVER_PORT}${PATHS.USERS}/${userUid}/portfolio_items`,
    {
      method: METHODS.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  return await response.json();
};

export default requestPortfolioItemCreate;
