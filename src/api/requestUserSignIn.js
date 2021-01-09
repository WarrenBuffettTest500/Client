import METHODS from '../constants/methods';

const requestUserSignIn = async (userInfo, path) => {
  const serverRoot
    = process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_SERVER_LOCALHOST
      : process.env.REACT_APP_PROD_SERVER_ROOT;

  const response = await fetch(`${serverRoot}${path}`, {
    method: METHODS.POST,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo),
  });

  return await response.json();
};

export default requestUserSignIn;
