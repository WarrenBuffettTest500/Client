import * as d3 from 'd3';

const parseDate = d3.utcParse('%Y-%m-%d');

const dateToObject = dateList => {
  if (!dateList) return;

  let dateToObjectData = [];

  for (let i = 0; i < dateList.length; i++) {
    dateToObjectData.push({
      date: parseDate(dateList[i]['datetime']),
      high: +dateList[i].high,
      low: +dateList[i].low,
      open: +dateList[i].open,
      close: +dateList[i].close,
    });
  }

  return dateToObjectData;
};

export default dateToObject;
