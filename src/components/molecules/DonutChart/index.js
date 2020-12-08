import React from 'react';
import { CanvasJSChart } from 'canvasjs-react-charts';

const DonutChart = ({ data, title, centerText }) => {
  const options = {
    animationEnabled: true,
    theme: 'dark1',
    backgroundColor: '#152337',
    title: {
      text: title,
    },
    subtitles: [{
      text: centerText,
      verticalAlign: 'center',
      fontSize: 20,
      dockInsidePlotArea: true,
    }],
    data: [{
      type: 'doughnut',
      showInLegend: true,
      indexLabel: '{name}: {y}',
      yValueFormatString: '#,###\'%\'',
      startAngle: -90,
      dataPoints: data,
    }],
    legend: {
      horizontalAlign: 'right',
      verticalAlign: 'center',
    },
  };

  return (
    <CanvasJSChart options={options} />
  );
};

export default DonutChart;
