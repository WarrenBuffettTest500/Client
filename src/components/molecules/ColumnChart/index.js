import React from 'react';
import { CanvasJSChart } from 'canvasjs-react-charts';

const ColumnChart = ({ data, title }) => {
  const options = {
    animationEnabled: true,
    title: {
      text: 'All Time Summer Olympic Medals',
    },
    legend: {
      verticalAlign: 'center',
      horizontalAlign: 'right',
      reversed: true,
      fontSize: 16,
    },
    toolTip: {
      shared: true,
    },
    data: [
      {
        type: 'stackedColumn100',
        name: 'Gold',
        showInLegend: true,
        color: '#D4AF37',
        dataPoints: [
          { label: 'United States', y: 1118 },
          { label: 'Soviet Union', y: 473 },
          { label: 'Great Britain', y: 273 },
          { label: 'France', y: 243 },
          { label: 'Germany', y: 269 },
          { label: 'Italy', y: 243 },
          { label: 'Sweden', y: 195 },
          { label: 'China', y: 236 },
          { label: 'Russia', y: 194 },
          { label: 'East Germany', y: 192 },
        ],
      },
      {
        type: 'stackedColumn100',
        name: 'Silver',
        showInLegend: true,
        color: '#C0C0C0',
        dataPoints: [
          { label: 'United States', y: 897 },
          { label: 'Soviet Union', y: 376 },
          { label: 'Great Britain', y: 299 },
          { label: 'France', y: 272 },
          { label: 'Germany', y: 272 },
          { label: 'Italy', y: 212 },
          { label: 'Sweden', y: 210 },
          { label: 'China', y: 189 },
          { label: 'Russia', y: 156 },
          { label: 'East Germany', y: 165 },
        ],
      },
      {
        type: 'stackedColumn100',
        name: 'Bronze',
        showInLegend: true,
        color: '#CD7F32',
        dataPoints: [
          { label: 'United States', y: 789 },
          { label: 'Soviet Union', y: 355 },
          { label: 'Great Britain', y: 303 },
          { label: 'France', y: 310 },
          { label: 'Germany', y: 283 },
          { label: 'Italy', y: 236 },
          { label: 'Sweden', y: 233 },
          { label: 'China', y: 174 },
          { label: 'Russia', y: 187 },
          { label: 'East Germany', y: 162 },
        ],
      },
    ],
  };

  return <CanvasJSChart options={options} />;
};

export default ColumnChart;
