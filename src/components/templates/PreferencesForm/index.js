import React, { useState } from 'react';
import './index.scss';
import requestPreferenceInfoUpdate from '../../../api/requestPreferenceInfoUpdate';
import requestUserPreferenceIdUpdate from '../../../api/requestUserPreferenceIdUpdate';

const PreferencesForm = ({
  currentUser,
  onUserUpdate,
  onPreferenceInfoUpdate,
}) => {
  const [interestedSectors, setInterestedSectors] = useState([]);
  const [riskAppetite, setRiskAppetite] = useState('');
  const [stockProportion, setStockProportion] = useState('');
  const [preferredStockType, setPreferredStockType] = useState('');
  const [period, setPeriod] = useState('');

  const submitHandler = async event => {
    event.preventDefault();

    if (interestedSectors.length > 3) {
      alert('관심 섹터는 최대 3개까지 고를 수 있습니다');

      return;
    }

    if (
      !interestedSectors.length
      || !riskAppetite
      || !stockProportion
      || !preferredStockType
      || !period
    ) {
      alert('정보를 모두 입력해주세요');

      return;
    }

    const preferenceInfo = {
      interestedSectors,
      riskAppetite,
      stockProportion,
      preferredStockType,
      period,
    };

    const preferenceInfoResponse = await requestPreferenceInfoUpdate(currentUser, preferenceInfo);

    if (!currentUser.preferenceInfoId) {
      const userResponse = await requestUserPreferenceIdUpdate(currentUser, preferenceInfoResponse);

      onUserUpdate(userResponse.user);
    }

    onPreferenceInfoUpdate(preferenceInfoResponse.preferenceInfo);
  };

  const preferenceChangeHandler = event => {
    const newValue = event.target.value;

    switch (event.target.name) {
      case 'interested-sector':
        if (event.target.checked) {
          setInterestedSectors(previous => [...previous, newValue]);
        } else {
          setInterestedSectors(previous => {
            return previous.filter(sector => sector !== newValue);
          });
        }
        return;
      case 'risk-appetite':
        setRiskAppetite(newValue);
        return;
      case 'stock-proportion':
        setStockProportion(newValue);
        return;
      case 'preferred-stock-type':
        setPreferredStockType(newValue);
        return;
      case 'period':
        setPeriod(newValue);
        return;
      default:
        return;
    }
  };

  return (
    <div className='preferencesFormWrapper'>
      <form onChange={preferenceChangeHandler}>
        <ul>
          <li>관심 섹터 (최대 3개)</li>
          <input type='checkbox' name='interested-sector' value='energy' />
          <label> Energy</label><br />
          <input type='checkbox' name='interested-sector' value='materials' />
          <label> Materials</label><br />
          <input type='checkbox' name='interested-sector' value='industrials' />
          <label> Industrials</label><br />
          <input type='checkbox' name='interested-sector' value='utilities' />
          <label> Utilities</label><br />
          <input type='checkbox' name='interested-sector' value='healthcare' />
          <label> Healthcare</label><br />
          <input type='checkbox' name='interested-sector' value='financials' />
          <label> Financials</label><br />
          <input type='checkbox' name='interested-sector' value='consumer-discretionary' />
          <label> Consumer Discretionary</label><br />
          <input type='checkbox' name='interested-sector' value='consumer-staples' />
          <label> Consumer Staples</label><br />
          <input type='checkbox' name='interested-sector' value='information-technology' />
          <label> Information Technology</label><br />
          <input type='checkbox' name='interested-sector' value='communication-services' />
          <label> Communication Services</label><br />
          <input type='checkbox' name='interested-sector' value='real-estate' />
          <label> Real Estate</label><br /><br />
          <li>위험 선호도</li>
          <input type='radio' name='risk-appetite' value='high' />
          <label> 높음 (손해 40% 이상 감수)</label><br />
          <input type='radio' name='risk-appetite' value='medium' />
          <label> 중간 (손해 20% 이상 40% 미만 감수)</label><br />
          <input type='radio' name='risk-appetite' value='low' />
          <label> 낮음 (손해 20% 미만 감수)</label><br /><br />
          <li>자산 중 주식 비중</li>
          <input type='radio' name='stock-proportion' value='below20' />
          <label> 20% 미만</label><br />
          <input type='radio' name='stock-proportion' value='below40' />
          <label> 20% 이상 40% 미만</label><br />
          <input type='radio' name='stock-proportion' value='below60' />
          <label> 40% 이상 60% 미만</label><br />
          <input type='radio' name='stock-proportion' value='below80' />
          <label> 60% 이상 80% 미만</label><br />
          <input type='radio' name='stock-proportion' value='above80' />
          <label> 80% 이상</label><br /><br />
          <li>선호 주식 종류</li>
          <input type='radio' name='preferred-stock-type' value='growth' />
          <label> 성장주</label><br />
          <input type='radio' name='preferred-stock-type' value='dividends' />
          <label> 가치주 배당주</label><br /><br />
          <li>예상 투자 기간</li>
          <input type='radio' name='period' value='short' />
          <label> 2년 미만</label><br />
          <input type='radio' name='period' value='mid' />
          <label> 2년 이상 5년 미만</label><br />
          <input type='radio' name='period' value='long' />
          <label> 5년 이상 10년 미만</label><br />
          <input type='radio' name='period' value='very-long' />
          <label> 10년 이상</label><br />
        </ul>
      </form>
      <input type='submit' value='제출' onClick={submitHandler} />
    </div>
  );
};

export default PreferencesForm;
