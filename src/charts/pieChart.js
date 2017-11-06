import { h, Component } from 'preact'
import lightColor from '../utils/lightColor'
import { arc, pie } from 'd3-shape'
import Tooltip from '../components/tooltip'
import { mouse, selectAll } from 'd3-selection'

export default class PieChart extends Component {
  constructor(props) {
    super();
    this.state = {
      tooltipVisible: false,
      pieLegend: props.series[0].data.map((d) => d.name),
      mousePosition: [0, 0],
      index: 0
    }
    this.arc = arc()
    this.pathNodes = []
  }

  get serie() {
    return this.props.series[0]
  }

  get size() {
    return this.props.size
  }

  get position() {
    return this.serie.center.map(this.convertStringToNumber)
  }

  get radius() {
    return this.convertStringToNumber(this.serie.radius)
  }

  get outerRadius() {
    return this.props.size.width / 2 * this.radius
  }

  get innerRadius() {
    return 0
  }

  get offsetLeft() {
    return this.size.width * this.position[0]
  }

  get offsetTop() {
    return this.size.height * this.position[1]
  }

  get convertData() {
    return [...this.serie.data].filter((d, i) => {
      if (!~this.state.pieLegend.indexOf(d.name)) {
        return false;
      }
      return true;
    });
  }

  get pieData() {
    return pie().value((d) => {
      return d.value
    })(this.convertData).map((d) => {
      d.outerRadius = this.outerRadius
      d.innerRadius = this.innerRadius
      return d
    })
  }

  convertStringToNumber(str) {
    return parseFloat(str) / 100
  }

  over (e) {
    const relate = e.relatedTarget
    const src = e.srcElement
    if (!relate) {
      return
    }
    if (relate.nodeName === 'svg' && src.nodeName === 'path') {
      setTimeout(() => {
        this.setState({
          tooltipVisible: true
        })
      }, 100)
    } else if (relate.nodeName === 'path' && src.nodeName === 'path') {
      this.setState({
        index: src.className.baseVal.match(/arc-(\d)/)[1]
      })
    }
  }

  out (e) {
    const relate = e.relatedTarget
    const src = e.srcElement
    if (!src) {
      return
    }
    if (relate.nodeName === 'svg' && src.nodeName === 'path') {
      setTimeout(() => {
        this.setState({
          tooltipVisible: false
        })
      }, 100)
    }
  }

  move () {
    const self = this
    selectAll(this.pathNodes)
      .on('mousemove', function () {
        self.setState({
          mousePosition: mouse(this)
        })
      })
  }

  componentDidMount() {
    this.move()
  }

  render(props, state) {
    return (
      <div className="h3-container pie-chart" style={{position: 'relative'}}>
        <svg width={props.size.width} height={props.size.height}>
          <g className="pie"
            transform={`translate(${this.offsetLeft}, ${this.offsetTop})`} >
            {
              this.pieData.map((d, i) => {
                return (
                  <g>
                    <path className={`${d.name} arc arc-${i}`}
                      fill={lightColor(d.data.color, 0)}
                      d={this.arc(d)}
                      onMouseOver={this.over.bind(this)}
                      onMouseOut={this.out.bind(this)}
                      ref={ (node) => {
                        this.pathNodes.push(node)
                      }} />
                    <text transform={`translate(${this.arc.centroid(d)[0] * 2.8}, ${this.arc.centroid(d)[1] * 2.8})`} font-weight='lighter' stroke={lightColor(d.data.color, 0)}>{d.data.name}</text>
                    <line stroke={lightColor(d.data.color, 0)}
                      x1={this.arc.centroid(d)[0] * 2}
                      y1={this.arc.centroid(d)[1] * 2}
                      x2={this.arc.centroid(d)[0] * 2.5}
                      y2={this.arc.centroid(d)[1] * 2.5} />
                  </g>
                )
              })
            }
          </g>
        </svg>
        <Tooltip formatter={this.props.tooltip.formatter}
          serie={this.serie}
          visible={ this.state.tooltipVisible }
          index={this.state.index}
          position={ this.state.mousePosition }
          offset={ {
            left: this.offsetLeft,
            top: this.offsetTop
          } } />
      </div>
    )
  }
}