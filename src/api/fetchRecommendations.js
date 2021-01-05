import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const fetchRecommendations = async (recommendationCriterion, currentUser, page) => {
  const host
    = process.env === 'development'
      ? process.env.REACT_APP_LOCALHOST
      : process.env.REACT_APP_PROD_SERVER_HOST;
  let fetchUrl;

  if (recommendationCriterion === 'preference') {
    fetchUrl = `${host}${PATHS.SERVER_PORT}${PATHS.USERS}/${currentUser.uid}/portfolios/recommendations/preference/?page=${page}`;
  } else if (recommendationCriterion === 'portfolio') {
    fetchUrl = `${host}${PATHS.SERVER_PORT}${PATHS.USERS}/${currentUser.uid}/portfolios/recommendations/portfolio/?page=${page}`;
  } else {
    fetchUrl = `${host}${PATHS.SERVER_PORT}/portfolios/random`;
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
