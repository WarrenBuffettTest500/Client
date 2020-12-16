import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CandlestickChart = ({ data, interval }) => {
  const chart = useRef(null);
  const tooltip = useRef(null);
  const width = 1800;
  const height = 550;
  const margin = { top: 20, right: 100, bottom: 30, left: 40 };
  const x = d3.scaleBand()
    .domain(d3.utcDay
      .range(data[data.length - 1].date, +data[0].date + 1))
    .range([margin.left, width - margin.right])
    .padding(10);

  const y = d3.scaleLog()
    .domain([d3.min(data, d => d.low), d3.max(data, d => d.high)])
    .rangeRound([height - margin.bottom, margin.top]);

  const xAxis = g => g
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x)
      .tickValues(d3.utcMonday
        .every(width > 720 ? 1 : 2)
        .range(data[data.length - 1].date, data[0].date))
      .tickFormat(d3.utcFormat('%-m/%-d')))
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('.tick')
      .attr('class', 'tick x'));

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
  const formatChange = (y0, y1) => {
    const f = d3.format('+.2%');
    return f((y1 - y0) / y0);
  };

  const candlestickChart = () => {
    const div = d3.select(tooltip.current)
      .style('opacity', 0);

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
      .attr('transform', d => `translate(${x(d.date)}, 0)`);

    g.append('line')
      .attr('y1', d => y(d.low))
      .attr('y2', d => y(d.high));

    g.append('line')
      .attr('class', 'chart_stick')
      .attr('y1', d => y(d.open))
      .attr('y2', d => y(d.close))
      .attr('stroke-width', 20)
      .attr('stroke', d => d.open > d.close
        ? d3.schemeSet1[0]
        : d.close > d.open
          ? d3.schemeSet1[2]
          : d3.schemeSet1[8]);

    g.on('mouseover', (event, data) => {
      div.transition()
        .duration(100)
        .style('opacity', 0.9);
      div.html(
        `${formatDate(data.date)} <br/>
           Open: ${formatValue(data.open)} <br/>
           Close: ${formatValue(data.close)} (${formatChange(data.open, data.close)}) <br/>
           Low: ${formatValue(data.low)} <br/>
           High: ${formatValue(data.high)}`)
        .style('left', event.clientX + 'px')
        .style('top', event.clientY + 'px');
    });
  };

  useEffect(() => {
    if (!data) return;
    candlestickChart();
  }, [data]);

  return (
    <>
      <div className='tooltip' ref={tooltip}></div>
      <svg className={`candle_stock_chart ${interval}`} ref={chart} />
    </>
  );
};

export default CandlestickChart;
