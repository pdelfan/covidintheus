async function drawTable() {

  // load data
  let dataset = await d3.csv('https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-states.csv')

  const dateParser = d3.timeParse("%Y-%m-%d")
  const dateAccessor = d => dateParser(d.date)

  const table = d3.select("#table")

  const dateFormat = d => d3.timeFormat("%b %d")(dateParser(d))
  const hourFormat = d => d3.timeFormat("%-I %p")(new Date(d * 1000))
  const format24HourTime = d => +d3.timeFormat("%H")(new Date(d * 1000))

  const numberOfRows = 55

  // const casesColorScale = d3.interpolateRgbBasis([
  //   "#d8d8ff",
  //   "#6262ff"
  // ])

  const grayColorScale = d3.interpolateHcl("#fff", "#bdc4ca")   // wind speed

  const caseScale = d3.scaleLinear()
    .domain(d3.extent(dataset.slice(0, numberOfRows), d => +d["confirmed_cases"]))
    .range(["#d8d8ff", "#6262ff"])

  const deathScale = d3.scaleLinear()
    .domain(d3.extent(dataset.slice(0, numberOfRows), d => +d["confirmed_deaths"]))
    .range(["#ffd8d8", "#ff6262"])

  const columns = [
    // { label: "DATE", type: "date", format: d => dateFormat(d.date) },
    { label: "STATE", type: "text", format: d => d.state },
    { label: "CONFIRMED CASES", type: "number", format: d => (+d["confirmed_cases"]), background: d => (caseScale(d["confirmed_cases"])) },
    { label: "CONFIRMED DEATHS", type: "number", format: d => +d["confirmed_deaths"], background: d => (deathScale(d["confirmed_deaths"])) }  // Use colors blue to red to indicate temperature
    // { label: "PROBABLE CASES", type: "number", format: d => d3.format(".0f")(+d["probable_cases"]), background: d => (probableCaseScale(d["probable_cases"])) }, // Use colors white to slate gray to indicate windspeed
    // { label: "PROBABLE DEATHS", type: "symbol", format: d => (+d["probable_deaths"]), background: d => (probableDeathScale(d["probable_deaths"])) },
  ]

  table.append("thead").append("tr")
    .selectAll("thead")
    .data(columns)
    .enter().append("th")
    .text(d => d.label)
    .attr("class", d => d.type)

  const body = table.append("tbody")

  dataset.slice(0, numberOfRows).forEach(d => {
    body.append("tr")
      .selectAll("td")
      .data(columns)
      .enter().append("td")
      .text(column => column.format(d))
      .attr("class", column => column.type)
      .style("background", column => column.background && column.background(d))
      .style("transform", column => column.transform && column.transform(d))
  })



}
drawTable()
