import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestPreferenceInfoUpdate = async (user, info) => {
  const host
    = process.env === 'development'
      ? process.env.REACT_APP_LOCALHOST
      : process.env.REACT_APP_PROD_SERVER_HOST;

  const response = await fetch(
    `${host}${PATHS.SERVER_PORT}${PATHS.USERS}/${user.uid}/preference_infos`, {
    method: user.preferenceInfoId ? METHODS.PUT : METHODS.POST,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(info),
  });

  return await response.json();
};

export default requestPreferenceInfoUpdate;
