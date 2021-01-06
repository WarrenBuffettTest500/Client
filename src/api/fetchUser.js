import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const fetchUser = async () => {
  const serverRoot
    = process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_LOCALHOST
      : process.env.REACT_APP_PROD_SERVER_ROOT;

  const response = await fetch(
    `${serverRoot}${PATHS.USERS}/current_user`, {
    method: METHODS.GET,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return await response.json();
};

export default fetchUser;
