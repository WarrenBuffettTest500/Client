import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestHitUpdate = async keyword => {
  const response = await fetch(
    `${PATHS.HOST}${PATHS.SERVER_PORT}/hits/${keyword}`,
    {
      method: METHODS.POST,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return await response.json();
};

export default requestHitUpdate;
