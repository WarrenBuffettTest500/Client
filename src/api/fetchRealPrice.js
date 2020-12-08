import METHODS from '../constants/methods';

const fetchRealPrice = async symbol => {
  const priceResponse = await fetch(`https://twelve-data1.p.rapidapi.com/price?symbol=${symbol}&outputsize=30&format=json`, {
    'method': METHODS.GET,
    'headers': {
      'x-rapidapi-key': process.env.REACT_APP_X_RAPIDAPI_KEY,
      'x-rapidapi-host': 'twelve-data1.p.rapidapi.com',
    },
  });

  const { price } = await priceResponse.json();

  return price;
};

export default fetchRealPrice;
