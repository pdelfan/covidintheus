async function displayText() {

  let dataset = await d3.csv("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us.csv", d3.autoType)
  var sumstat = d3.nest()
    .key(function (d) { return d.state })
    .entries(dataset)

  allKeys = sumstat.map(function (d) { return d.key })

  // width, height, margins
  let margin = { top: 25, right: 0, bottom: 0, left: -3 }
  let width = 270 - margin.left - margin.right
  let height = 75 - margin.top - margin.bottom

  // we'll use this for the content inside
  let boundedWidth = width - margin.left - margin.right
  let boundedHeight = height - margin.top - margin.bottom


  const wrapper = d3.select(".latestNumbers")
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
    .style("transform", `translate(${margin.left}px, ${margin.top}px)`) // we translate it here so we can use 0 later for range

  var cases = dataset[dataset.length - 1].cases
  var deaths = dataset[dataset.length - 1].deaths
  var formatNumber = d3.format(",")  // formatting number (adding comma for readability)

  // cases title
  bounds
    .append('g')
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle")
    .attr("font-size", (width * 0.005) + "em")
    .attr("font-weight", "normal")
    .attr("fill", "#1d3557")
    .attr('transform', 'translate(80, -25)')
    .append('text')
    .text("Cases");

  // cases count
  bounds
    .append('g')
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle")
    .attr("font-size", (width * 0.005) + "em")
    .attr("text-anchor", "middle")
    .attr("font-weight", "300")
    .attr("fill", "#1d3557")
    .attr('transform', 'translate(80, 20)')
    .append('text')
    .text(formatNumber(cases));

  // deaths title
  bounds
    .append('g')
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle")
    .attr("font-size", (width * 0.005) + "em")
    .attr("font-weight", "normal")
    .attr("fill", "red")
    .attr('transform', 'translate(210,-25)')
    .append('text')
    .text('Deaths');

  // deaths count
  bounds
    .append('g')
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle")
    .attr("font-size", (width * 0.005) + "em")
    .attr("text-anchor", "middle")
    .attr("font-weight", "300")
    .attr("fill", "red")
    .attr('transform', 'translate(210, 20)')
    .append('text')
    .text(formatNumber(deaths));


}

displayText()
