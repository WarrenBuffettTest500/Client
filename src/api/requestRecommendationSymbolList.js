import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestRecommendationSymbolList = async keyword  => {
  const response = await fetch(
    `${PATHS.HOST}${PATHS.SERVER_PORT}${PATHS.COMPANY_PROFILES}${PATHS.RECOMMENDATION_STOCK_LIST}/${keyword}`,
    {
      method: METHODS.GET,
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    },
  );

  return await response.json();
};

export default requestRecommendationSymbolList;
