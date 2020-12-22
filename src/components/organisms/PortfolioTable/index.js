import React from 'react';
import { Link } from 'react-router-dom';
import commaNumber from 'comma-number';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import AddIcon from '@material-ui/icons/Add';
import Button from '../../atoms/Button';
import { Decimal } from 'decimal.js';
import PATHS from '../../../constants/paths';

const PortfolioTable = ({
  currentUser,
  portfolioOwnerUid,
  portfolio,
  onCreateButtonClick,
  onEditButtonClick,
  onDeleteButtonClick,
}) => {
  const isOwnPortfolio = currentUser.uid === portfolioOwnerUid;
  const createClickHandler = () => {
    onCreateButtonClick();
  };
  const editClickHandler = (id, symbol, quantity, avgPrice) => {
    onEditButtonClick(id, symbol, quantity, avgPrice);
  };
  const deleteClickHandler = id => {
    onDeleteButtonClick(id);
  };

  return (
    <>
      <div className='portfolio_table_header'>
        <h3>주식 목록</h3>
        {
          isOwnPortfolio
          && <Button onClick={createClickHandler}>
            <AddIcon className='portfolio_item_create_button' />
          </Button>
        }
      </div>
      <table className='portfolio_table'>
        <tbody>
          <tr>
            <th>기업</th>
            {
              isOwnPortfolio
              && <>
                <th>보유량</th>
                <th>평단가</th>
              </>
            }
            <th>현재가</th>
            {
              isOwnPortfolio
              && <>
                <th>손익</th>
                <th>수익률</th>
                <th>평가금액</th>
                <th>매입금액</th>
                <th>수정</th>
                <th>삭제</th>
              </>
            }
          </tr>
          {
            portfolio.map(item => {
              const { id, symbol, quantity, avgPrice, price } = item;
              const earnings
                = new Decimal(price)
                  .minus(new Decimal(avgPrice))
                  .times(new Decimal(quantity))
                  .toDecimalPlaces(2)
                  .toString();
              const earningsRate
                = (new Decimal(price).dividedBy(new Decimal(avgPrice)))
                  .minus(1).times(100)
                  .toDecimalPlaces(2)
                  .toString();
              const currentTotal
                = new Decimal(price)
                  .times(new Decimal(quantity))
                  .toDecimalPlaces(2)
                  .toString();
              const buyingTotal
                = new Decimal(avgPrice)
                  .times(new Decimal(quantity))
                  .toDecimalPlaces(2)
                  .toString();

              return (
                <tr key={id}>
                  <td className='portfolio_table_narrow'>
                    {
                      <Link to={`${PATHS.STOCK_DETAILS}/${symbol}`}>
                        {symbol}
                      </Link>
                    }
                  </td>
                  {
                    isOwnPortfolio
                    && <>
                      <td className='portfolio_table_wide'>
                        {`${commaNumber(quantity)}주`}
                      </td>
                      <td className='portfolio_table_wide'>
                        {`$${commaNumber(avgPrice)}`}
                      </td>
                    </>
                  }
                  <td className='portfolio_table_wide'>
                    {`$${commaNumber(new Decimal(price).toDecimalPlaces(2).toString())}`}
                  </td>
                  {
                    isOwnPortfolio
                    && <>
                      <td className='portfolio_table_wide'>
                        {
                          Number(earnings) < 0
                            ? `-$${commaNumber(Math.abs(earnings))}`
                            : `$${commaNumber(earnings)}`
                        }
                      </td>
                      <td className='portfolio_table_wide'>
                        {`${commaNumber(earningsRate)}%`}
                      </td>
                      <td className='portfolio_table_wide'>
                        {`$${commaNumber(currentTotal)}`}
                      </td>
                      <td className='portfolio_table_wide'>
                        {`$${commaNumber(buyingTotal)}`}
                      </td>
                      <td className='portfolio_table_narrow'>
                        <Button
                          className='portfolio_item_edit_button'
                          onClick={editClickHandler.bind(null, id, symbol, quantity, avgPrice)}
                        >
                          <EditOutlinedIcon />
                        </Button>
                      </td>
                      <td className='portfolio_table_narrow'>
                        <Button
                          className='portfolio_item_remove_button'
                          onClick={deleteClickHandler.bind(null, id)}
                        >
                          <ClearRoundedIcon />
                        </Button>
                      </td>
                    </>
                  }
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </>
  );
};

export default PortfolioTable;
