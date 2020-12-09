import React, { useState } from 'react';
import * as d3 from 'd3';

const Arc = ({ arcData }) => {
  const [radiusAdd, setRadiusAdd] = useState(0);
  const arc = d3.arc().innerRadius(180 + radiusAdd / 2).outerRadius(240 + radiusAdd);

  const mouseOverHandler = () => {
    setRadiusAdd(7);
  };

  const mouseOutHandler = () => {
    setRadiusAdd(0);
  };

  return (
    <path
      d={arc(arcData)}
      index={arcData.data.index}
      fill={d3.schemePaired[arcData.index]}
      onMouseOver={mouseOverHandler}
      onMouseOut={mouseOutHandler}
    />
  );
};

const DonutChart = ({ data, x, y }) => {
  const pie = d3.pie().value(d => d.value);

  return (
    <g transform={`translate(${x}, ${y})`}>
      {
        pie(data).map(d => {
          return <Arc key={d.id} arcData={d} />;
        })
      }
    </g>
  );
};

export default DonutChart;
