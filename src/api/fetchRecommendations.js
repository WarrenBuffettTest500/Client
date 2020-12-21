import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const fetchRecommendations = async (recommendationCriterion, currentUser, page) => {
  let fetchUrl;

  if (recommendationCriterion === 'preference') {
    fetchUrl = `${PATHS.HOST}${PATHS.SERVER_PORT}${PATHS.USERS}/${currentUser.uid}/portfolios/recommendations/preference/?page=${page}`;
  } else if (recommendationCriterion === 'portfolio') {
    fetchUrl = `${PATHS.HOST}${PATHS.SERVER_PORT}${PATHS.USERS}/${currentUser.uid}/portfolios/recommendations/portfolio/?page=${page}`;
  } else {
    fetchUrl = `${PATHS.HOST}${PATHS.SERVER_PORT}/portfolios/random`;
  }

  const response = await fetch(fetchUrl, {
    method: METHODS.GET,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return await response.json();
};

export default fetchRecommendations;
