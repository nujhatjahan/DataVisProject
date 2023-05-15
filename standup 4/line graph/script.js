function init() {
    // Sample data for the graph
const data = [
    { name: 'Series A', values: [4, 8, 15, 16, 23, 42] },
    { name: 'Series B', values: [15, 10, 7, 12, 14, 20] },
    { name: 'Series C', values: [10, 5, 18, 12, 20, 8] },
    { name: 'Series D', values: [2, 6, 12, 18, 24, 36] },
    { name: 'Series E', values: [8, 5, 3, 9, 11, 16] }

  ];
  
  // Graph dimensions
  const width = 600;
  const height = 400;
  const padding = 40;
  
  // Create SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  
  // Find the maximum value in the data
  const max = Math.max(...data.flatMap(({ values }) => values));
  
  // Calculate scaling factors
  const xScale = (width - 2 * padding) / (data[0].values.length - 1);
  const yScale = (height - 2 * padding) / max;
  
  // Draw lines
  data.forEach(series => {
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    const points = series.values.map((value, index) => {
      const x = padding + index * xScale;
      const y = height - padding - value * yScale;
      return `${x},${y}`;
    }).join(' ');
    polyline.setAttribute('points', points);
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', 'steelblue');
    svg.appendChild(polyline);
  });
  
  // Draw x-axis
  const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxis.setAttribute('x1', padding);
  xAxis.setAttribute('y1', height - padding);
  xAxis.setAttribute('x2', width - padding);
  xAxis.setAttribute('y2', height - padding);
  xAxis.setAttribute('stroke', 'black');
  svg.appendChild(xAxis);
  
  // Draw y-axis
  const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAxis.setAttribute('x1', padding);
  yAxis.setAttribute('y1', padding);
  yAxis.setAttribute('x2', padding);
  yAxis.setAttribute('y2', height - padding);
  yAxis.setAttribute('stroke', 'black');
  svg.appendChild(yAxis);
  
  // Append SVG to the DOM
  const container = document.getElementById('graph-container');
  container.appendChild(svg);
  
}

window.onload = init;
