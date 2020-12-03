import METHOD from '../constants/method';
import PATHS from '../constants/paths';

const requestSignIn = async (userInfo, path) => {
  const response = await fetch(
    `${PATHS.HOST}${PATHS.SERVER_PORT}${path}`,
    {
      method: METHOD.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        userInfo,
      ),
    },
  );

  return response.json();
};

export default requestSignIn;
