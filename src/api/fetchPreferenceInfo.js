import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const fetchPreferenceInfo = async user => {
  const serverRoot
    = process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_LOCALHOST
      : process.env.REACT_APP_PROD_SERVER_ROOT;

  const response = await fetch(
    `${serverRoot}${PATHS.USERS}/${user.uid}/preference-infos/${user.preferenceInfoId}`, {
    method: METHODS.GET,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return await response.json();
};

export default fetchPreferenceInfo;
