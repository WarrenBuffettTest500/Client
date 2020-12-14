import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestHitUpdate = async keyword => {
  const res = await fetch(
    `${PATHS.HOST}${PATHS.SERVER_PORT}/hits/${keyword}`,
    {
      method: METHODS.POST,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  const response = await res.json();
  console.log(response);
};

export default requestHitUpdate;
