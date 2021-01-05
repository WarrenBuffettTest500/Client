import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestUserSignIn = async (userInfo, path) => {
  const host
    = process.env === 'development'
      ? process.env.REACT_APP_LOCALHOST
      : process.env.REACT_APP_PROD_SERVER_HOST;

  const response = await fetch(`${host}${PATHS.SERVER_PORT}${path}`, {
    method: METHODS.POST,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo),
  });

  return await response.json();
};

export default requestUserSignIn;
