import React from 'react';
import { CanvasJSChart } from 'canvasjs-react-charts';

const CircleChart = ({
  data,
  title,
  centerText,
  type,
  hasLabel = true,
}) => {
  const options = {
    animationEnabled: true,
    theme: 'dark1',
    backgroundColor: '#152337',
    title: {
      text: title,
    },
    subtitles:
      type === 'doughnut'
        ? [{
          text: centerText,
          verticalAlign: 'center',
          fontSize: 20,
          dockInsidePlotArea: true,
        }]
        : null,
    data: [{
      type: type,
      showInLegend: true,
      indexLabel: hasLabel ? '{name}: {y}' : null,
      yValueFormatString: '#,###\'%\'',
      startAngle: -90,
      dataPoints: data,
      explodeOnClick: true,
    }],
  };

  return (
    <CanvasJSChart options={options} />
  );
};

export default CircleChart;
