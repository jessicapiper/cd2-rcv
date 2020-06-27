import * as d3 from "d3";
import results from "../_data/results";

var margin = {top: 20, right:20, bottom:120, left:140};

var container = d3.select('#rcv');
var containerWidth = 650//container.node().offsetWidth;
var containerHeight = containerWidth * 0.66;
var chartWidth = containerWidth - margin.right - margin.left;
var chartHeight = containerHeight - margin.top - margin.bottom;

var svg = container.append('svg')
            .attr('width', containerWidth)
            .attr('height', containerHeight)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)

var yDomain = results.map(d => d.candidate)
var xDomain = [0,.6]

var yScale = d3.scaleBand()
    .domain(yDomain)
    .range([chartHeight,0])
    .padding(0.1);

var xScale = d3.scaleLinear()
    .domain(xDomain)
    .range([0, chartWidth]);

var formatAxis = d3.format(",.0%");

var xAxis = d3.axisBottom(xScale)
  .tickFormat(formatAxis)
  .tickSize(-chartHeight)
  .ticks(9);
var yAxis = d3.axisLeft(yScale);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(xAxis)
    .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size","14px")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

svg.append("g")
    .style("font","14px")
    .attr("class", "y axis")
    .call(yAxis)
    .selectAll("text")
        .style("font-size","14px");

var keys = ["ballot1","ballot2"]

var series = d3.stack().keys(keys)(results)

console.log(series);

var color = d3.scaleOrdinal()
  .domain(keys)
  .range(d3.schemeDark2)
  //.range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), series.length).reverse())
  .unknown("#ccc")

svg.append("g")
  .selectAll("g")
  .data(series)
  .enter().append("g")
    .attr("fill", d => color(d.key))
  .selectAll("rect")
  .data(d => d)
  .join("rect")
    .attr("x", d => xScale(d[0]))//d => x(d[0]))
    .attr("y", d => yScale(d.data.candidate))
    .attr("width", d => xScale(d[1]-d[0]))
    .attr("height",yScale.bandwidth());

console.log('hello, this is my charts file!');
