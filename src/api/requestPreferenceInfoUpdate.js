import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestPreferenceInfoUpdate = async (user, info) => {
  const serverRoot
    = process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_SERVER_LOCALHOST
      : process.env.REACT_APP_PROD_SERVER_ROOT;

  const response = await fetch(
    `${serverRoot}${PATHS.USERS}/${user.uid}/preference_infos`, {
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
