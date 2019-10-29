import * as d3 from 'd3'

const margin = { top: 50, left: 50, right: 50, bottom: 50 }
const width = 700 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

function responsivefy(svg) {
  // get container + svg aspect ratio
  var container = d3.select(svg.node().parentNode),
    width = parseInt(svg.style('width')),
    height = parseInt(svg.style('height')),
    aspect = width / height

  // add viewBox and preserveAspectRatio properties,
  // and call resize so that svg resizes on inital page load
  svg
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('perserveAspectRatio', 'xMinYMid')
    .call(resize)

  d3.select(window).on('resize.' + container.attr('id'), resize)

  // get width of container and resize svg to fit it
  function resize() {
    var targetWidth = parseInt(container.style('width'))
    svg.attr('width', targetWidth)
    svg.attr('height', Math.round(targetWidth / aspect))
  }
}

const canvas = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)

canvas
  .append('rect')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .attr('x', 0)
  .attr('y', 0)
  .attr('fill', 'none')
  .attr('stroke', 'black')
  .attr('stroke-width', 4)

canvas.call(responsivefy)
// sin(2x)^2 + cos(x)

const svg = canvas
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleLinear()
  .domain([0, 51])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([-3, 3])
  .range([height, 0])

const colorScale = d3.scaleOrdinal(d3.schemeTableau10)

const line = d3
  .line()
  .x(d => xPositionScale(d))
  .y((d, i) => yPositionScale(f(d)))
  .curve(d3.curveCatmullRom.alpha(1))

const datapoints = [
  d3.range(0, 8, 0.1),
  d3.range(0, 51, 0.1),
  d3.range(0, 22, 0.1)
]

svg
  .selectAll('path')
  .data(datapoints)
  .enter()
  .append('path')
  .attr('d', line)
  .attr('fill', 'none')
  .attr('stroke', (_, i) => colorScale(i))
  .attr('stroke-width', 10)
  .attr('transform', (_, i) => `translate(0, ${i * 10})`)

function f(x) {
  return Math.sin(0.1 * x) ** 2 - Math.sin(0.3 * x)
}
