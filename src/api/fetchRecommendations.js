import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const fetchRecommendations = async (recommendationCriterion, currentUser, page) => {
  const serverRoot
    = process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_LOCALHOST
      : process.env.REACT_APP_PROD_SERVER_ROOT;
  let fetchUrl;

  if (recommendationCriterion === 'preference') {
    fetchUrl = `${serverRoot}${PATHS.USERS}/${currentUser.uid}/portfolios/recommendations/preference/?page=${page}`;
  } else if (recommendationCriterion === 'portfolio') {
    fetchUrl = `${serverRoot}${PATHS.USERS}/${currentUser.uid}/portfolios/recommendations/portfolio/?page=${page}`;
  } else {
    fetchUrl = `${serverRoot}/portfolios/random`;
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
