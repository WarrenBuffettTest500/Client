import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestPreferenceInfoUpdate = async (user, info) => {
  const response = await fetch(
    `${PATHS.HOST}${PATHS.SERVER_PORT}${PATHS.USERS}/${user.uid}/preference_infos`,
    {
      method: user.preferenceInfoId ? METHODS.PUT : METHODS.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info),
    },
  );

  return await response.json();
};

export default requestPreferenceInfoUpdate;
