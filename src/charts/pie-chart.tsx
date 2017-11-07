import { mouse, selectAll } from 'd3-selection'
import { arc, pie } from 'd3-shape'
import { Component, h  } from 'preact'
import Legend from '../components/legend'
import Pie, { DataItem, SerieItem } from '../components/pie/index'
import Tooltip from '../components/tooltip'

interface PropsType {
  size: {
    width: number,
    height: number
  }
  boundary: {
    left: number
  }
  tooltip: {
    formatter: string
  }
  legend: {
    offset: {
      left: string,
      top: string
    }
  }
  isDrawEventContainer: boolean
  series: SerieItem[]
}

interface StateTypes {
  tooltipVisible: boolean
  index: number
  mousePosition: number[]
}

export default class PieChart extends Component<PropsType, StateTypes> {
  constructor () {
    super()
    this.state = {
      tooltipVisible: true,
      index: 0,
      mousePosition: [0, 0]
    }
  }

  private get serie () {
    return this.props.series[0]
  }

  private get data () {
    return this.serie.data
  }

  private get position () {
    return this.serie.center.map(this.convertStringToNumber)
  }

  private get offsetLeft () {
    return this.props.size.width * this.position[0]
  }

  private get offsetTop () {
    return this.props.size.height * this.position[1]
  }

  public render (props) {
    return (
      <div className="h3-container pie-chart" style={{position: 'relative'}}>
        <svg className="pie-container" width={props.size.width} height={props.size.height}>
          <Pie data={this.props.series[0].data}
            size={{width: this.props.size.width, height: this.props.size.height}}
            radius={this.convertStringToNumber(this.serie.radius)}
            left={this.offsetLeft}
            top={this.offsetTop} />
          <Legend data={this.props.series[0].data}/>
        </svg>
        {
          <Tooltip formatter={this.props.tooltip.formatter}
            serie={this.serie}
            index={this.state.index}
            offset={{
              left: this.offsetLeft,
              top: this.offsetTop
            }} />}
      </div>
    )
  }

  private convertStringToNumber (str) {
    return parseFloat(str) / 100
  }

}
