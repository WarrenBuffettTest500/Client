import React, { useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import * as d3 from 'd3';
import commaNumber from 'comma-number';
import PATHS from '../../../constants/paths';

const CircleChart = ({ data, type, total, page }) => {
  const svgRef = useRef();
  const history = useHistory();

  useEffect(() => {
    const width = 240;
    const height = 190;
    const radius = Math.min(width, height) / 2;
    const pie = d3.pie()
      .padAngle(0.005)
      .sort((a, b) => b.value - a.value)
      .value(d => d.value);
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());
    const arc = d3.arc()
      .innerRadius(type === 'donut' ? radius * 0.67 : 0)
      .outerRadius(radius - 1);
    const arcOver = d3.arc()
      .innerRadius(type === 'donut' ? radius * 0.67 : 0)
      .outerRadius(radius + 7);
    const arcs = pie(data);
    const svg = d3.select(svgRef.current)
      .attr('viewBox', [
        -width / 2,
        -height / 2,
        width,
        height,
      ]);

    svg.selectAll('*').remove();

    svg.selectAll('path')
      .data(arcs)
      .join('path')
      .attr('fill', d => {
        if (d.data.value === 100) return '#4288b5';
        return color(d.data.name);
      })
      .attr('d', arc)
      .append('title')
      .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 8)
      .attr('text-anchor', 'middle')
      .selectAll('text')
      .data(arcs)
      .join('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .call(text => text.append('tspan')
        .attr('y', '-0.4em')
        .attr('font-weight', 'bold')
        .text(d => {
          if (Number(d.data.value) < 5) return;
          return d.data.name;
        }))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append('tspan')
        .attr('x', 0)
        .attr('y', '0.7em')
        .attr('fill-opacity', 0.7)
        .text(d => {
          if (Number(d.data.value) < 5) return;
          return `${d.data.value.toLocaleString()}%`;
        }));

    svg.selectAll('path')
      .on('mouseenter', function() {
        d3.select(this)
          .transition()
          .duration(450)
          .attr('d', arcOver);

        if (page === 'portfolio') {
          d3.select(this).style('cursor', 'pointer');
        }
      })
      .on('mouseleave', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arc)
          .style('cursor', 'default');
      });

    if (page === 'portfolio') {
      svg.selectAll('path')
        .on('click', event => {
          const { name: symbol } = event.target.__data__.data;
          history.push(`${PATHS.STOCK_DETAILS}/${symbol}`);
        });
    }

    if (type !== 'donut') return;

    svg.append('text')
      .attr('text-anchor', 'middle')
      .text(total ? `$${commaNumber(parseFloat(total).toFixed(2))}` : null)
      .style('fill', 'white')
      .attr('font-weight', 'bold');
  }, [data]);

  return (
    <svg
      className='circle_chart'
      ref={svgRef}
    />
  );
};


export default CircleChart;
