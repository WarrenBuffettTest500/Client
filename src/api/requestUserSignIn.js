import METHODS from '../constants/methods';

const requestUserSignIn = async (userInfo, path) => {
  const host
    = process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_LOCALHOST
      : process.env.REACT_APP_PROD_SERVER_HOST;

  const response = await fetch(`${host}${path}`, {
    method: METHODS.POST,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo),
  });

  return await response.json();
};

export default requestUserSignIn;
