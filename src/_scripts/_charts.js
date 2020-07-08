import * as d3 from "d3";
import results from "../_data/results";
import round2 from "../_data/round2.json";
import round3 from "../_data/round3.json";

function firstRound(element){

var margin = {top: 20, right:20, bottom:120, left:110};

var container = d3.select(element);
var containerWidth = container.node().offsetWidth;
var containerHeight = 300;
var chartWidth = containerWidth - margin.right - margin.left;
var chartHeight = containerHeight - margin.top - margin.bottom;

var svg = container.append('svg')
            .attr('width', containerWidth)
            .attr('height', containerHeight)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)

var yDomain = results.map(d => d.candidate)
var xDomain = [0,.5]

var yScale = d3.scaleBand()
    .domain(yDomain)
    .range([chartHeight,0])
    .padding(0.1);

var xScale = d3.scaleLinear()
    .domain(xDomain)
    .range([0, chartWidth]);

var formatAxis = d3.format(",.0%");
//  .attr('stroke','lightgray');

var xAxis = d3.axisBottom(xScale)
  .tickFormat(formatAxis)
  .tickSize(-chartHeight)
  .ticks(9);

var yAxis = d3.axisLeft(yScale);

var error = .03;

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${chartHeight})`)
    //.attr("stroke", "#808080")
    .call(xAxis)
    //.attr("stroke", "blue")
    .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size","12px")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

svg.append("g")
    .style("font","12px")
    .attr("class", "y axis")
    .call(yAxis)
    .selectAll("text")
        .style("font-size","12px");

var keys = ["ballot1"]

var series = d3.stack().keys(keys)(results)

console.log(series);

var color = d3.scaleOrdinal()
  .domain(keys)
  .range(["#c4002a","red"])
  //.range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), series.length).reverse())
  .unknown("#ccc")

var tooltip = svg.append('text')
    .attr('class', 'chart-tooltip');

svg.append("g")
  .selectAll("g")
  //.attr("stroke", "lightgray")
  .data(series)
  .enter().append("g")
    .attr("fill", d => color(d.key))
  .selectAll("rect")
  .data(d => d)
  .join("rect")
    .attr("x", d => xScale(d[0]))//d => x(d[0]))
    .attr("y", d => yScale(d.data.candidate))
    .attr("width", d => xScale(d[1]-d[0]))
    .attr("height",yScale.bandwidth())
  .on('mouseenter', function(d) {
      //var coordinates= d3.mouse(this);
      var xPosition = xScale(d[1])+5//400//xScale(d.ballot1) + 0.1//coordinates[0]+10//coordinates[0];
      var yPosition = yScale(d.data.candidate)+28//coordinates[1]-10//coordinates[1] + 25;
      d3.select(this).classed('highlight-red', true);
      tooltip.html(d3.format(",.0%")(d[1]))//(d3.format("$,.0f")(xScale(d[1]-d[0]))
            //.style("opacity", 1)
            .attr('transform',`translate(${xPosition}, ${yPosition}) `)
            .moveToFront();//rotate (-10)`)
    })
    .on('mouseleave', function(d) {
      d3.select(this).classed('highlight-red', false);
      tooltip.text('');
    });

}

firstRound('#rcv1');

function thirdRound(element){

var margin = {top: 20, right:60, bottom:120, left:110};

var container = d3.select(element);
var containerWidth = container.node().offsetWidth;
var containerHeight = 270;
var chartWidth = containerWidth - margin.right - margin.left;
var chartHeight = containerHeight - margin.top - margin.bottom;

var svg = container.append('svg')
            .attr('width', containerWidth)
            .attr('height', containerHeight)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)

var yDomain = round3.map(d => d.candidate)
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
    .attr("transform", `translate(0,${chartHeight + 50})`)
    .call(xAxis)
    .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size","12px")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

svg.append("g")
    .style("font","12px")
    .attr("class", "y axis")
    .attr("transform", `translate(0,50)`)
    .call(yAxis)
    .selectAll("text")
        .style("font-size","12px");

var keys = ["First ballot","Redistributed votes"]

var series = d3.stack().keys(keys)(round3)

console.log(series);

var color = d3.scaleOrdinal()
  .domain(keys)
  .range(["#c4002a","gold"])
  //.range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), series.length).reverse())
  .unknown("#ccc")

var tooltip = svg.append('text')
    .attr('class', 'chart-tooltip');

svg.append("g")
  .selectAll("g")
  .data(series)
  .enter().append("g")
    .attr("fill", d => color(d.key))
  .selectAll("rect")
  .data(d => d)
  .join("rect")
    .attr("x", d => xScale(d[0]))//d => x(d[0]))
    .attr("y", d => yScale(d.data.candidate)+50)
    .attr("width", d => xScale(d[1]-d[0]))
    .attr("height",yScale.bandwidth())
    .on('mouseenter', function(d) {
        var coordinates= d3.mouse(this);
        function getEl(c){
        if(c[0] < xScale(d[1]-d[0])) {
          return('highlight-red');
        }else {
          return('highlight-yellow');
        }
        }
        function getText(c){
          if(c[0] < xScale(d[1]-d[0])){
            return("Round 1 votes: " + d3.format(",.0%")(d[1]-d[0]));
          }else {
            return("Final tally: " + (d[1]*100) + "%");
          }
        }
        function getX(c){
          if(c[0] < xScale(d[1]-d[0])){
            return(chartWidth*6/7);
          }else {
            return(xScale(d[1])+3);
          }
        }
        var x = getX(coordinates);//chartWidth - chartWidth/8//xScale(d[1])+15//400//xScale(d.ballot1) + 0.1//coordinates[0]+10//coordinates[0];
        var y = yScale(d.data.candidate)+65;
        d3.select(this).classed(getEl(coordinates),true);
        tooltip.text(getText(coordinates))//d3.format(",.0%")(d[1]))//(d3.format("$,.0f")(xScale(d[1]-d[0]))
              .style("opacity", 1)
              .attr('transform',`translate(${x}, ${y}) `)
              //.moveToFront();//rotate (-10)`)
      })
      .on('mouseleave', function(d) {
        d3.select(this).classed('highlight-red', false);
        d3.select(this).classed('highlight-yellow', false);
        tooltip.text('');
      });

var legend = svg.append("g")
  .attr("width",series.length * 36)
  .attr("height",40)
  .attr("font-family", "helvetica")
  .attr("font-size", 10)
  //.style("margin-left", `${margin.left}px`)
  .attr("text-anchor", "left")
  .style("display", "block")
  .selectAll("g")
  .data(series)//(keys)
  .join("g")
    .attr("transform", (d, i) => `translate(${i * 60},0)`);

legend.append("rect")
      .attr("x", 0)
      .attr("y",0)
      .attr("width", 20)
      .attr("height", 15)
      .attr("fill", d => color(d.key));

legend.append("text")
  .attr("x", 0)
  .attr("y",25)
  .attr("dy", "0.35em")
  .text(d => d.key);

}

//thirdRound('#rcv3');

function secondRound(element,lastname){

var margin = {top: 0, right:0, bottom:0, left:0};

var container = d3.select(element);
var containerWidth = container.node().offsetWidth;
var containerHeight = Math.max(250,containerWidth)//containerWidth;
var chartWidth = containerWidth - margin.right - margin.left;
var chartHeight = containerHeight - margin.top - margin.bottom;

var svg = container.append('svg')
            .attr('width', containerWidth)
            .attr('height', containerHeight)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)

var radius = containerHeight/2 - 60;

var data = round2.map(d => d[lastname])//{a: 9, b: 20, c:30, d:8, e:12}
var labels = round2.map(d => d.candidate)

//tooltip
var tooltip = svg.append('text')
    .attr('class', 'chart-tooltip');

// set the color scale
var color = d3.scaleOrdinal()
  .domain(data[1,2,3])
  .range(["#bf7d0d", "#ffe100", "#f0b043", "#ababab"])

// Compute the position of each group on the pie:
var pie = d3.pie()
  .value(function(d) {return d.value; })
var data_ready = pie(d3.entries(data))

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg.selectAll('g')
  .data(data_ready)
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(1)
    .outerRadius(radius)
  )
  .attr('fill', function(d){ return(color(d.data.key)) })
  .attr("stroke", "white")
  .style("stroke-width", "1px")
  .style("opacity", 1)
  .attr("transform", `translate(${chartWidth/2},${chartHeight/2})`)
  .on('mouseenter', function(d) {
      d3.select(this).classed('highlight-gray', true);
      tooltip.html(labels[d.data.key] + ": " + d.data.value*100 + "%")//(d3.format("$,.0f")(xScale(d[1]-d[0]))
            .style("opacity", 1)
            .attr('transform',`translate(80, 50)`)//(${xPosition}, ${yPosition}) `)
            //.attr('transform',`translate(arcGenerator.centroid(d))`)
    })
    .on('mouseleave', function(d) {
      d3.select(this).classed('highlight-gray', false);
      tooltip.text('');
    });

var legend = svg.append("g")
  .attr("width",data_ready.length * 36)
  .attr("height",40)
  .attr("font-family", "helvetica")
  .attr("font-size", 9)
  //.style("margin-left", `${margin.left}px`)
  .attr("text-anchor", "left")
  .style("display", "block")
  .selectAll("g")
  .data(function(d){
    if(data[0]==0){
      return(data_ready.slice(1,4));
    }else if (data[2]==0) {
      return(data_ready.slice(0,2).concat(data_ready.slice(3,4)));
    }else{
      return(data_ready.slice(0,1).concat(data_ready.slice(2,4)));
    }
  })
  .join("g")
    .attr("transform", (d, i) => `translate(${i * 80},0)`);

legend.append("rect")
      .attr("x", 5)
      .attr("y",0)
      .attr("width", 20)
      .attr("height", 15)
      .attr("fill", d => color(d.data.key));

legend.append("text")
  .attr("x", 5)
  .attr("y",25)
  .attr("dy", "0.35em")
  .text(d => labels[d.data.key]);

}

secondRound('#BrakeyVoters','Brakey');
secondRound('#BennettVoters','Bennett');
secondRound('#CraftsVoters','Crafts');

console.log('hello, this is my charts file!');
