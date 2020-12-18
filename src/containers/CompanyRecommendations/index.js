import React, { useEffect, useState, useRef } from 'react';
import Card from '../../components/atoms/Card';
import { useHistory } from 'react-router-dom';
import PATHS from '../../constants/paths';
import requestCompanyProfiles from '../../api/requestCompanyProfiles';
import { useSelector, useDispatch } from 'react-redux';
import { setRecommendationSymbolList, setCompanyProfileList } from '../../store/stock';
import { useInfinteScroll } from '../../hooks';

const CompanyRecommendations = ({
  className,
}) => {
  const viewport = useRef(null);
  const card = useRef(null);
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

  const cardClickHandler = path => {
    history.push(path);
  };

  const onIntersection = async ([{ isIntersecting }]) => {
    if (!recommendationSymbolList.length || !isIntersecting) return;

    const data = await requestCompanyProfiles(recommendationSymbolList);

    dispatch(setRecommendationSymbolList(recommendationSymbolList?.slice(1)));
    dispatch(setCompanyProfileList([...companyProfileList, data]));
  };

  useEffect(() => {
    if (!recommendationSymbolList.length) return;

    (async () => {
      const data = await requestCompanyProfiles(recommendationSymbolList);

      dispatch(setRecommendationSymbolList(recommendationSymbolList?.slice(1)));
      dispatch(setCompanyProfileList([data]));
    })();
  }, []);

  useInfinteScroll({
    root: viewport.current,
    target,
    callback: onIntersection,
    threshold: 0.1,
    rootMargin: '500px',
  });

  const scrollIntoView = () => {
    if (!card.current) return;

    card.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollIntoView, [target]);

  return (
    <div ref={viewport} className={className}>
      {
        companyProfileList
        && companyProfileList.map(item => (
          <div key={item.symbol}>
            <Card
              onClick={() => cardClickHandler(`${PATHS.STOCK_DETAILS}/${item.symbol}`)}
              className='company_card'
            >
              <div className='card_item_wrapper' ref={card}>
                <h3 className='company_symbol'>{item.symbol}</h3>
                <p>{`${item.percent_change}%`}</p>
                <p>{item.name}</p>
                <p>{`$${item.close}`}</p>
              </div>
            </Card>
            <div ref={setTarget} className='last_company_card' />
            <div ref={setTarget} className='last_company_card' />
          </div>
        ))
      }
    </div>
  );
};

export default CompanyRecommendations;
