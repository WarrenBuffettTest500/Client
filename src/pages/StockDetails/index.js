import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Card from '../../components/molecules/Card';
import ListWrapper from '../../components/molecules/ListWrapper';
import requestCompanyProfiles from '../../api/requestCompanyProfiles';
import StockChart from '../../components/molecules/StockChart';

const StockDetails = () => {
  const stockDetails = useSelector(state => state.stock.searchStockDetails);
  const [keywords, setKeywords] = useState(['NDAQ', 'NWSA']);
  const [companyProfileList, setCompanyProfileList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await requestCompanyProfiles(keywords);

        setCompanyProfileList(data);
      } catch (error) {
        console.error(error.message);
      }
    })();
  }, []);

  return (
    <>
      <div>StockDetails</div>
      {/* <StockChart dataSet={stockDetails}></StockChart> */}
      <ListWrapper className='companyCardListWrapper'>
        {companyProfileList.map(companyProfile =>
          <Card
            key={companyProfile['Global Quote']['01. symbol']}
            className='companyCard'>
            <h3>{companyProfile['Global Quote']['01. symbol']}</h3>
            <p>{`$${companyProfile['Global Quote']['05. price']}`}</p>
            <p>{companyProfile['Global Quote']['10. change percent']}</p>
          </Card>)}
      </ListWrapper>
    </>
  );
};

export default StockDetails;
