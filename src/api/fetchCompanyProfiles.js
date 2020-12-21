import METHODS from '../constants/methods';

const fetchCompanyProfiles = async symbolList => {
  const { symbol } = symbolList[0];

  try {
    const companyProfilesResponse = await fetch(
      `https://twelve-data1.p.rapidapi.com/quote?symbol=${symbol}&interval=1day&format=json&outputsize=30`, {
      'method': METHODS.GET,
      'headers': {
        'x-rapidapi-key': process.env.REACT_APP_X_RAPIDAPI_KEY,
        'x-rapidapi-host': 'twelve-data1.p.rapidapi.com',
      },
    });

    const { change, close, name, percent_change } = await companyProfilesResponse.json();

    return { change, close, name, percent_change, symbol };
  } catch (error) {
    console.error(error);
  }
};

export default fetchCompanyProfiles;
