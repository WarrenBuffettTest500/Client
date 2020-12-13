import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const CircleChart = ({ data, type }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 250;
    const height = 180;
    const radius = Math.min(width, height) / 2;
    const pie = d3.pie()
      .padAngle(0.005)
      .sort((a, b) => b.value - a.value)
      .value(d => d.value);
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());
    const arc = d3.arc().innerRadius(type === 'donut' ? radius * 0.67 : 0).outerRadius(radius - 1);
    const arcs = pie(data);
    const svg = d3.select(svgRef.current).attr('viewBox', [-width / 2, -height / 2, width, height]);

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
  }, [data]);

  return (
    <div className='circle_chart_wrapper'>
      <svg className='circle_chart' ref={svgRef}></svg>
    </div>
  );
};

export default CircleChart;
