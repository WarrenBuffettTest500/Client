import React from 'react';
import FormInputField from '../../molecules/FormInputField';

const PreferencesSectorField = () => {
  const sectors = [
    { 'Energy': 'Energy' },
    { 'Basic Materials': 'Basic Materials' },
    { 'Industrials': 'Industrials' },
    { 'Utilities': 'Utilities' },
    { 'Healthcare': 'Healthcare' },
    { 'Financial Services': 'Financial Services' },
    { 'Consumer Cyclical': 'Consumer Cyclical' },
    { 'Consumer Defensive': 'Consumer Defensive' },
    { 'Technology': 'Technology' },
    { 'Communication Services': 'Communication Services' },
    { 'Real Estate': 'Real Estate' },
  ];

  return (
    <FormInputField
      type='checkbox'
      title='관심 섹터 (최대 3개)'
      options={sectors}
      name='interested-sector'
    />
  );
};

export default PreferencesSectorField;
