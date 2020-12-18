import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestUserSignIn = async (userInfo, path) => {
  const response = await fetch(`${PATHS.HOST}${PATHS.SERVER_PORT}${path}`, {
    method: METHODS.POST,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo),
  });

  return await response.json();
};

export default requestUserSignIn;
