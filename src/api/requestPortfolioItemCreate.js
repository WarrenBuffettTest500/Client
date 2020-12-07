import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestPortfolioItemCreate = async (user, data) => {
  const response = await fetch(
    `${PATHS.HOST}${PATHS.SERVER_PORT}${PATHS.USERS}/${user.uid}/portfolio_items`,
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
