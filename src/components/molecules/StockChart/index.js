import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const StockChart = ({ dataSet }) => {
  const chart = useRef(null);
  const [data, setData] = useState(dataSet.values);

  const width = 1200;
  const height = 600;
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };

  const x = d3.scaleBand()
    .domain(d3.utcDay
      // .range(data[0].datetime, +data[data.length - 1].datetime + 1)
      .range(new Date('2018-01-01'), new Date(data[data.length - 1].datetime))
      .filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6))
    .range([margin.left, width - margin.right])
    .padding(0.2);

  const y = d3.scaleLog()
    .domain([d3.min(data, d => d.low), d3.max(data, d => d.high)])
    .rangeRound([height - margin.bottom, margin.top]);

  const xAxis = g => g
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x)
      .tickValues(d3.utcMonday
        .every(width > 720 ? 1 : 2)
        .range(data[0].datetime, data[data.length - 1].datetime))
      .tickFormat(d3.utcFormat('%-m/%-d')))
    .call(g => g.select('.domain').remove());

  const yAxis = g => g
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y)
      .tickFormat(d3.format('$~f'))
      .tickValues(d3.scaleLinear().domain(y.domain()).ticks()))
    .call(g => g.selectAll('.tick line').clone()
      .attr('stroke-opacity', 0.2)
      .attr('x2', width - margin.left - margin.right))
    .call(g => g.select('.domain').remove());

  const formatDate = d3.utcFormat('%B %-d, %Y');

  const formatValue = d3.format('.2f');

  const f = d3.format('+.2%');
  const formatChange = () => {
    return (y0, y1) => f((y1 - y0) / y0);
  };
  const parseDate = d3.utcParse('%Y-%m-%d');

  const candlestickChart = () => {
    const svg = d3.select(chart.current)
      .attr('viewBox', [0, 0, width, height]);

    svg.append('g')
      .call(xAxis);

    svg.append('g')
      .call(yAxis);

    const g = svg.append('g')
      .attr('stroke-linecap', 'round')
      .attr('stroke', 'black')
      .selectAll('g')
      .data(data)
      .join('g')
      .attr('transform', d => `translate(${x(new Date(d.datetime))},0)`);

    g.append('line')
      .attr('y1', d => y(d.low))
      .attr('y2', d => y(d.high));

    g.append('line')
      .attr('y1', d => y(d.open))
      .attr('y2', d => y(d.close))
      .attr('stroke-width', x.bandwidth())
      .attr('stroke', d => d.open > d.close ? d3.schemeSet1[0]
        : d.close > d.open ? d3.schemeSet1[2]
          : d3.schemeSet1[8]);

    g.append('title')
      .text(d => `${formatDate(d.datetime)}
  Open: ${formatValue(d.open)}
  Close: ${formatValue(d.close)} (${formatChange(d.open, d.close)})
  Low: ${formatValue(d.low)}
  High: ${formatValue(d.high)}`);
  };

  useEffect(() => {
    candlestickChart();
  }, []);

  return (
    <div>
      <h1>chart</h1>
      <svg ref={chart} />
    </div>
  );
};

export default StockChart;
