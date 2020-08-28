async function drawAreaChart() {

    let dataset = await d3.csv("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv", d3.autoType)
    var sumstat = d3.nest()
      .key(function(d) {return d.state})
      .entries(dataset)

    allKeys = sumstat.map(function(d){return d.key})

    // width, height, margins
    let margin = {top: 30, right: 5, bottom: 30, left: 5}
    let width = 155 - margin.left - margin.right
    let height = 200 - margin.top - margin.bottom

    // we'll use this for the content inside
    let boundedWidth = width - margin.left - margin.right
    let boundedHeight = height - margin.top - margin.bottom


    const wrapper = d3.select(".wrapper")
   .selectAll("uniqueChart")
   .data(sumstat)
   .enter()
   .append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
   .append("g")
     .attr("transform",
           "translate(" + margin.left + "," + margin.top + ")");

    // inside the svg where data elements will go (gray area in margin convention image)
    const bounds = wrapper.append("g")
        .style("transform", `translate(${ margin.left }px, ${ margin.top }px)`) // we translate it here so we can use 0 later for range

    // x scale
    const xScale = d3.scaleTime()
      .domain(d3.extent(dataset, function(d) { return d.date }))
      .range([ 0, boundedWidth ])


    const xAxisGenerator = d3.axisBottom()
      .ticks(3)
      .tickFormat(d3.timeFormat('%b'))  // shorthand month name
      .scale(xScale)

    const xAxis = bounds.append("g")
      .call(xAxisGenerator)
      .attr("transform", "translate(0," + boundedHeight + ")")
      .attr("color", "gray")

    // y scale
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, function(d) { return +d.deaths })])
      .range([ boundedHeight, 0 ])
      .nice()


    //draw the area
    bounds
    .append("path")
      .attr("fill", "#f8d6d3")
      .attr("stroke", "none")
      .attr("d", function(d){
        return d3.area()
        .x(function(d) { return xScale(d.date) })
        .y0(yScale(0))
        .y1(function(d) { return yScale(+d.deaths) })
          (d.values)
      })


    // draw the line
    bounds
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#e83323")
      .attr("stroke-width", 1.8)
      .style("stroke-linejoin", "round")
      .attr("d", function(d){
      return d3.line()
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(d.deaths); })
        (d.values)
    })


    // title
    bounds
      .append("text")
      .attr("text-anchor", "start")
      .attr("y", 10)
      .attr("x", 0)
      .text(function(d){ return(d.key)})
      .style("font-family", "sans-serif")
      .style("font-size", "0.8em")
      .style("font-weight", "normal")
      .style("fill", "#111")


    // deaths label for latest date
    var formatNumber = d3.format(",")  // formatting number (adding comma for readability)
    bounds
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", function(d) {return xScale(d.values[d.values.length-1].date)})
      .attr("y", function(d) {return yScale(d.values[d.values.length-1].deaths)-3})
      .text(function(d) { return formatNumber(d.values[d.values.length-1].deaths)})
      .style("font-family", "sans-serif")
      .style("font-size", "0.6em")

}

drawAreaChart()
