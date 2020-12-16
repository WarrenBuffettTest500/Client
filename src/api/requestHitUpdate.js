import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestHitUpdate = symbol => {
  fetch(`${PATHS.HOST}${PATHS.SERVER_PORT}/hits/${symbol}`, {
    method: METHODS.POST,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default requestHitUpdate;
