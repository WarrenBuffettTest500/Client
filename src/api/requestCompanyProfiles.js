import METHODS from '../constants/methods';

const requestCompanyProfiles = async keywords => {
  try {
    const companyProfiles = await Promise.all(
      keywords.map(async keyword => {
        const response = await fetch(`https://alpha-vantage.p.rapidapi.com/query?function=GLOBAL_QUOTE&symbol=${keyword}`, {
          'method': METHODS.GET,
          'headers': {
            'x-rapidapi-key': process.env.REACT_APP_X_RAPIDAPI_KEY,
            'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com'
          }
        });

        return await response.json();
      }),
    );
    
    return companyProfiles;
  } catch (error) {
    console.error(error);
  }
};

export default requestCompanyProfiles;
