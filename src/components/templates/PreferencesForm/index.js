import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './index.scss';
import requestPreferenceInfoUpdate from '../../../api/requestPreferenceInfoUpdate';
import requestUserPreferenceIdUpdate from '../../../api/requestUserPreferenceIdUpdate';
import PATHS from '../../../constants/paths';
import TOAST_APPEARANCES from '../../../constants/toastAppearances';
import { useToasts } from 'react-toast-notifications';
import PreferencesSectorField from '../../organisms/PreferencesSectorField';
import FormInputField from '../../molecules/FormInputField';

const PreferencesForm = ({
  currentUser,
  onUserUpdate,
  onPreferenceInfoUpdate,
}) => {
  const { addToast } = useToasts();
  const [interestedSectors, setInterestedSectors] = useState([]);
  const [riskAppetite, setRiskAppetite] = useState('');
  const [stockProportion, setStockProportion] = useState('');
  const [preferredStockType, setPreferredStockType] = useState('');
  const [period, setPeriod] = useState('');
  const history = useHistory();
  const riskAppetiteTypes = [
    { high: ' 높음 (손해 40% 이상 감수)' },
    { meduim: ' 중간 (손해 20% 이상 40% 미만 감수)' },
    { low: '낮음 (손해 20% 미만 감수)' },
  ];
  const stockProportionsTypes = [
    { below20: '  20% 미만' },
    { below40: '  40% 미만' },
    { below60: '  60% 미만' },
    { below80: '  80% 미만' },
    { above80: '  80% 이상' },
  ];
  const preferredStockTypes = [
    { growth: ' 성장주' },
    { dividends: ' 배당주' },
  ];
  const investmentPeriods = [
    { short: ' 2년 미만' },
    { mid: ' 2년 이상 5년 미만' },
    { long: ' 5년 이상 10년 미만' },
    { 'very-long': ' 10년 이상' },
  ];

  const submitHandler = async event => {
    event.preventDefault();

    if (interestedSectors.length > 3) {
      addToast('관심 섹터는 최대 3개까지 고를 수 있습니다', {
        appearance: TOAST_APPEARANCES.WARNING,
        autoDismiss: true,
      });

      return;
    }

    if (
      !interestedSectors.length
      || !riskAppetite
      || !stockProportion
      || !preferredStockType
      || !period
    ) {
      addToast('정보를 모두 입력해주세요', {
        appearance: TOAST_APPEARANCES.WARNING,
        autoDismiss: true,
      });

      return;
    }

    const fillInterestedSectors = () => {
      const copy = interestedSectors.slice();

      for (let i = 1; i < 3; i++) {
        if (!copy[i]) {
          copy[i] = null;
        }
      }

      return copy;
    };

    const preferenceInfo = {
      interestedSectors: fillInterestedSectors(),
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

    history.push(PATHS.ROOT);
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
          <PreferencesSectorField /><br />
          <FormInputField
            type='radio'
            title='위험 선호도'
            options={riskAppetiteTypes}
            name='risk-appetite'
          /><br />
          <FormInputField
            type='radio'
            title='자산 중 주식 비중'
            options={stockProportionsTypes}
            name='stock-proportion'
          /><br />
          <FormInputField
            type='radio'
            title='선호 주식 종류'
            options={preferredStockTypes}
            name='preferred-stock-type'
          /><br />
          <FormInputField
            type='radio'
            title='예상 투자 기간'
            options={investmentPeriods}
            name='period'
          />
        </ul>
      </form>
      <input type='submit' value='제출' onClick={submitHandler} />
    </div>
  );
};

export default PreferencesForm;
