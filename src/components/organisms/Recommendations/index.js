import React, { useRef } from 'react';
import Card from '../../atoms/Card';
import CircleChart from '../../molecules/CircleChart';

const Recommendations = ({
  recommendedChartDatas,
  lastRecommendationRef,
  onRecommendationClick,
}) => {
  const cardRefs = useRef({});

  const recommendationClickHandler = portfolio => {
    onRecommendationClick(portfolio);
  };

  return (
    <div className='recommended_portfolios_wrapper'>
      {
        recommendedChartDatas.map((portfolio, index) => {
          const isLastRecommendationData
            = index === recommendedChartDatas.length - 1;

          return (
            <div
              key={portfolio.owner}
              ref={element => isLastRecommendationData ? lastRecommendationRef(element) : null}
              className='recommendation_wrapper'
            >
              <Card className='portfolio_card'>
                <div
                  className='circle_chart_wrapper portfolio_wrapper'
                  ref={element => cardRefs.current[index] = element}
                  onClick={() => recommendationClickHandler(portfolio)}
                >
                  <CircleChart
                    data={portfolio.items}
                    type='pie'
                    category='recommended'
                  />
                </div>
              </Card>
            </div>
          );
        })
      }
    </div>
  );
};

export default Recommendations;
