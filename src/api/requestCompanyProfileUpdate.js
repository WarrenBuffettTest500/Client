import METHODS from '../constants/methods';
import PATHS from '../constants/paths';

const requestCompanyProfileUpdate = async symbol => {
  try {
    const response = await fetch(`${PATHS.HOST}${PATHS.SERVER_PORT}${PATHS.COMPANY_PROFILES}/${symbol}${PATHS.VIEWS}`, {
      method: METHODS.PUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await response.json();
  } catch (error) {
    alert(error.message);
  }
};

export default requestCompanyProfileUpdate;
