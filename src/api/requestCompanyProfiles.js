import METHODS from '../constants/methods';

const requestCompanyProfiles = async symbolList => {
  //memo: 레이지 로딩 구현 전까지는 3개정도만 요청하게 설정했어요
  const slice = symbolList.slice(0, 3);

  try {
    const companyProfiles = await Promise.all(
      slice.map(async item => {
        const response = await fetch(`https://alpha-vantage.p.rapidapi.com/query?function=GLOBAL_QUOTE&symbol=${item.symbol}`, {
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
