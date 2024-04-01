const penguins = d3.csv("penguins_size.csv");

penguins.then(function(data) {
  // Convert relevant string values to numbers and filter out invalid data
  data = data.map(function(d) {
    return {
      flipper_length_mm: +d.flipper_length_mm,
      body_mass_g: +d.body_mass_g
    };
  }).filter(function(d) {
    return !isNaN(d.flipper_length_mm) && !isNaN(d.body_mass_g);
  });

  const margin = { top: 10, right: 100, bottom: 100, left: 160 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  const svg = d3.select("#plot")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const minX = d3.min(data, d => d.flipper_length_mm);
  const maxX = d3.max(data, d => d.flipper_length_mm);
  const minY = d3.min(data, d => d.body_mass_g);
  const maxY = d3.max(data, d => d.body_mass_g);

  const x = d3.scaleLinear()
    .domain([minX * 0.95, maxX])
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([minY * 0.95, maxY])
    .range([height, 0]);

  // X Axis
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // Y Axis
  svg.append("g")
    .call(d3.axisLeft(y));

  // X Axis Label
  svg.append("text")             
    .attr("transform",
          "translate(" + (width/2) + " ," + 
                         (height + margin.top + 40) + ")")
    .style("text-anchor", "middle")
    .text("Flipper Length (mm)");

  // Y Axis Label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Body Mass (g)"); 

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", d => x(d.flipper_length_mm))
      .attr("cy", d => y(d.body_mass_g))
      .attr("r", 5)
      .style("fill", "#69b3a2");

  // Trend Line calc
  const sumX = d3.sum(data, d => d.flipper_length_mm);
  const sumY = d3.sum(data, d => d.body_mass_g);
  const sumXY = d3.sum(data, d => d.flipper_length_mm * d.body_mass_g);
  const sumXX = d3.sum(data, d => d.flipper_length_mm * d.flipper_length_mm);
  const n = data.length;

  const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const b = (sumY - m * sumX) / n;

  // Trend Line
  svg.append("line")
    .attr("x1", x(minX))
    .attr("y1", y(m * minX + b))
    .attr("x2", x(maxX))
    .attr("y2", y(m * maxX + b))
    .attr("stroke", "red")
    .attr("stroke-width", 2);
});
