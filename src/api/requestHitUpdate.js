import METHODS from '../constants/methods';

const requestHitUpdate = symbol => {
  const serverRoot
    = process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_LOCALHOST
      : process.env.REACT_APP_PROD_SERVER_ROOT;

  fetch(`${serverRoot}/hits/${symbol}`, {
    method: METHODS.POST,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default requestHitUpdate;
