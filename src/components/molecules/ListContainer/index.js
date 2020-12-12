import React, { useEffect, useState, useRef } from 'react';
import Card from '../../molecules/Card';
import { useHistory } from 'react-router-dom';
import PATHS from '../../../constants/paths';
import requestCompanyProfiles from '../../../api/requestCompanyProfiles';
import { useSelector, useDispatch } from 'react-redux';
import { setRecommendationSymbolList, setCompanyProfileList } from '../../../store/stock';
import { useInfinteScroll } from '../../../hooks';

const ListContainer = ({
  className,
}) => {
  const viewport = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const [target, setTarget] = useState(null);
  const {
    recommendationSymbolList,
    companyProfileList,
  } = useSelector(state => ({
    recommendationSymbolList: state.stock?.recommendationSymbolList,
    companyProfileList: state.stock?.companyProfileList,
  }));

  const onCardClick = path => {
    history.push(path);
  };

  const callback = async ([{ isIntersecting }]) => {
    if (!recommendationSymbolList.length || !isIntersecting) return;

    const data = await requestCompanyProfiles(recommendationSymbolList, 1);

    dispatch(setRecommendationSymbolList(recommendationSymbolList?.slice(1)));
    dispatch(setCompanyProfileList([...companyProfileList, ...data]));
  };

  useEffect(() => {
    if (!recommendationSymbolList.length) return;

    const count = recommendationSymbolList.length < 3 ? recommendationSymbolList.length : 3;
    (async () => {
      const data = await requestCompanyProfiles(recommendationSymbolList, count);

      dispatch(setRecommendationSymbolList(recommendationSymbolList?.slice(count)));
      dispatch(setCompanyProfileList(data));
    })();
  }, []);

  useInfinteScroll({
    root: viewport.current,
    target,
    callback,
    threshold: 0.3,
    rootMargin: '10px',
  });

  return (
    <div ref={viewport} className={className}>
      {companyProfileList && companyProfileList.map(item =>
        <>
          <Card
            key={item['Global Quote']['01. symbol']}
            onClick={() => onCardClick(`${PATHS.STOCK_DETAILS}/${item['Global Quote']['01. symbol']}`)}
            className='company_card'>
            <h3>{item['Global Quote']['01. symbol']}</h3>
            <p>{`$${item['Global Quote']['05. price']}`}</p>
            <p>{item['Global Quote']['10. change percent']}</p>
          </Card>
          <div ref={setTarget} className='last_company_card' />
          <div ref={setTarget} className='last_company_card' />
        </>,
      )}
    </div>
  );
};

export default ListContainer;
