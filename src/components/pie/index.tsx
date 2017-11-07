import { easeElastic } from 'd3-ease'
import { mouse, MySeletion, select, selectAll } from 'd3-selection'
import { arc, pie } from 'd3-shape'
import { Component, h } from 'preact'
import { changeCurrentPie, changeMousePosition, changeMouseState, changePieData } from '../../store/actions'
import lighter from '../../utils/light-color'

export interface DataItem {
  name: string
  color: string | (() => string)
  value: number | string
}

export interface SerieItem {
  radius: string
  title: string
  center: string[],
  data: DataItem[]
}

interface PieProps {
  data: DataItem[]
  size: {
    width: number
    height: number
  }
  radius: number
  top: number
  left: number
}

interface PieState {
  pieLegend: any[]
  current: number
}

export default class Pie extends Component<PieProps, PieState> {
  private arc: any
  private innerRadius: number = 0
  private pathNodes: any[] = []
  private textNodes: any[] = []
  private timer = null
  private previous: number = -1
  private pathSelection: MySeletion
  private textSelection: MySeletion

  constructor (props) {
    super()
    this.arc = arc()
    this.state = {
      pieLegend: props.data.map((d) => d.name),
      current: -1
    }
  }

  private get store () {
    return this.context.store
  }

  private get pieChartStore () {
    return this.store.getState().pieChart
  }

  private get outerRadius () {
    return this.props.size.width / 2 * this.props.radius
  }

  private get convertData () {
    return [...this.pieChartStore.propsData].filter((d, i) => {
      if (!~this.state.pieLegend.indexOf(d.name)) {
        return false
      }
      return true
    })
  }

  private get pieData () {
    return pie().value((d) => {
      return d.value
    })(this.convertData).map((d) => {
      d.outerRadius = this.outerRadius
      d.innerRadius = this.innerRadius
      return d
    })
  }

  public componentWillMount () {
    this.store.dispatch(changePieData(this.props.data))
  }

  public componentDidMount () {
    this.move()
    this.store.subscribe(() => {
      const current = this.pieChartStore.currentPie
      if (this.previous !== current) {
        this.previous = current
        this.scaleThePie()
      }
    })
  }

  public componentWillUpdate () {
    this.remove()
    this.move()
  }

  public componentWillUnmount () {
    this.remove()
  }

  public render () {
    this.pathNodes = []
    this.textNodes = []
    return (
      <g className="pie"
        style={{transform: `translate(${this.props.left}px, ${this.props.top}px)`}}>
        {
          this.pieChartStore.propsData.map((d, i) => {
            const pd = this.pieData[i]
            return (
              <g key={i.toString()}>
                <path className={`${d.name} path path-${i}`}
                  fill={lighter(d.color, this.pieChartStore.currentPie === i ? 4 : 0)}
                  d={this.arc(this.pieData[i])}
                  onMouseOver={this.over}
                  onMouseOut={this.out}
                  cursor="pointer"
                  ref={ (node) => {
                    (this as any).pathNodes.push(node)
                  }} />
                <text className={`text text-${i}`}
                  transform={`translate(${this.arc.centroid(pd)[0] * 2.8}, ${this.arc.centroid(pd)[1] * 2.8})`}
                  font-weight="lighter"
                  cursor="pointer"
                  onMouseOver={this.over}
                  onMouseOut={this.out}
                  ref={ (node) => {
                    (this as any).textNodes.push(node)
                  }}
                  stroke={lighter(d.color, this.pieChartStore.currentPie === i ? 4 : 0)}>
                  {d.name}
                </text>
                <line stroke={lighter(d.color, this.pieChartStore.currentPie === i ? 4 : 0)}
                  x1={this.arc.centroid(pd)[0] * 2}
                  y1={this.arc.centroid(pd)[1] * 2}
                  x2={this.arc.centroid(pd)[0] * 2.5}
                  y2={this.arc.centroid(pd)[1] * 2.5} />
              </g>
            )
          })
        }
      </g>
    )
  }

  private scaleThePie () {
    const { prevPie, currentPie } = this.pieChartStore
    const prevData = this.pieData[prevPie]
    if (~prevPie && prevData) {
      select(`.path-${prevPie}`)
        .transition()
        .ease(easeElastic)
        .attr('d', () => {
          return this.arc(prevData)
        })
    }
    const currentData = this.pieData[currentPie]
    if (~currentPie && currentData) {
      currentData.outerRadius += 20
      select(`.path-${currentPie}`)
        .transition()
        .ease(easeElastic)
        .attr('d', () => {
          return this.arc(currentData)
        })
    }
  }

  private getCurrentPie (el) {
    return Number(el.className.baseVal.match(/[path|text]-(\d)/)[1])
  }

  private over = (e) => {
    const relate = e.relatedTarget
    const src = e.srcElement
    if (!relate) {
      return
    }
    if (relate.nodeName === 'svg' && (src.nodeName === 'path' || src.nodeName === 'text')) {
      setTimeout(() => {
        this.store.dispatch(changeMouseState('over'))
      }, 100)
    }
  }

  private out = (e) => {
    const relate = e.relatedTarget
    const src = e.srcElement
    if (!relate) {
      return
    }
    if (relate.nodeName === 'svg' && (src.nodeName === 'path' || src.nodeName === 'text')) {
      setTimeout(() => {
        this.store.dispatch(changeMouseState('out'))
      })
    }
  }

  private changeCurrentPie (el, mouseState) {
    const current: number = this.getCurrentPie(el)
    if (current !== this.pieChartStore.currentPie) {
      this.store.dispatch(changeCurrentPie(current, mouseState))
    }
  }

  private move = () => {
    const self = this
    this.pathSelection = selectAll((self as any).pathNodes)
      .on('mousemove', function () {
        self.store.dispatch(changeMousePosition(mouse(this)))
        self.changeCurrentPie(this, 'over')
      })
    this.textSelection = selectAll((self as any).textNodes)
      .on('mousemove', function () {
        const position = mouse(this)
        const currentPieData = self.pieData[self.getCurrentPie(this)]
        const offsetX = self.arc.centroid(currentPieData)[0] * 2.8
        const offsetY = self.arc.centroid(currentPieData)[1] * 2.8
        self.store.dispatch(changeMousePosition([
          position[0] + offsetX,
          position[1] + offsetY
        ]))
        self.changeCurrentPie(this, 'over')
      })
  }

  private remove () {
    this.pathSelection.on('mousemove', null)
    this.textSelection.on('mousemove', null)
  }
}
