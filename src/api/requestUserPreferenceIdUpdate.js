import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestUserPreferenceIdUpdate = async (user, info) => {
  const response = await fetch(
    `${PATHS.HOST}${PATHS.SERVER_PORT}${PATHS.USERS}/${user.uid}`, {
    method: METHODS.PUT,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(info),
  });

  return await response.json();
};

export default requestUserPreferenceIdUpdate;
