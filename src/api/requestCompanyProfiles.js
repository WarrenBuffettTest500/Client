import METHODS from '../constants/methods';
import companyProfiles_mock_data from '../components/molecules/ListContainer/companyProfiles.json';

const requestCompanyProfiles = async (symbolList, count) => {
  const requestSymbolList = symbolList.slice(0, count);
  const wait = time => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  };

  await wait(3000);

  return companyProfiles_mock_data.slice(0, count);
  // try {
  //   const companyProfiles = await Promise.all(
  //     requestSymbolList.map(async item => {
  //       const response = await fetch(`https://alpha-vantage.p.rapidapi.com/query?function=GLOBAL_QUOTE&symbol=${item.symbol}`, {
  //         'method': METHODS.GET,
  //         'headers': {
  //           'x-rapidapi-key': process.env.REACT_APP_X_RAPIDAPI_KEY,
  //           'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com',
  //         },
  //       });

  //       return await response.json();
  //     }),
  //   );

  //   return companyProfiles;
  // } catch (error) {
  //   console.error(error);
  // }
};

export default requestCompanyProfiles;
