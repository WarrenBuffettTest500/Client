import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const fetchRecommendationSymbolList = async keyword => {
  const response = await fetch(
    `${PATHS.HOST}${PATHS.SERVER_PORT}${PATHS.COMPANY_PROFILES}${PATHS.RECOMMENDATION_STOCK_LIST}/${keyword}`, {
    method: METHODS.GET,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return await response.json();
};

export default fetchRecommendationSymbolList;
