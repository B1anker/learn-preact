import { event, selectAll } from 'd3-selection'
import { Component, h } from 'preact'
import { changeCurrentPie, changePieData } from '../../store/actions'
import lighter from '../../utils/light-color'

interface LegendProps {
  data: any[]
  width?: number
  height?: number
}

export default class Legend extends Component<LegendProps, any> {
  private width: number = 36
  private height: number = 16
  private timer = null
  private legendNodes: any[] = []
  private legendStore: any[] = []

  constructor () {
    super()
  }

  private get store () {
    return this.context.store
  }

  private get pieChartStore () {
    return this.store.getState().pieChart
  }

  public componentWillMount () {
    this.legendStore = [...this.pieChartStore.propsData]
  }

  public componentDidMount () {
    this.move()
  }

  public render () {
    this.legendNodes = []
    return (
      <g className="legend">
        {
          this.legendStore.map((d, i) => {
            return (
              <g key={i.toString()}
                className={`legend-${i} ${d.disactive ? 'disactive' : ''}`}
                ref={(node) => {
                  this.legendNodes.push(node)
                }}
                onClick={this.handleClick}>
                <rect
                  className={`rect-${i}`}
                  width={this.width}
                  height={this.height}
                  fill={
                    d.disactive ? '#eee' : lighter(d.color, i === this.pieChartStore.currentPie ? 4 : 0)
                  }
                  rx={4}
                  cursor="pointer"
                  y={i * 24} />
                <text x={48}
                  className={`text-${i}`}
                  y={i * 24 + this.height / 2}
                  dy="-.7em"
                  cursor="pointer"
                  stroke={
                    d.disactive ? '#eee' : lighter(d.color, i === this.pieChartStore.currentPie ? 4 : 0)
                  }
                  font-weight="lighter"
                  alignment-baseline="before-edge"
                >
                  {d.name}
                </text>
              </g>
            )
          })
        }
      </g>
    )
  }

  private getCurrentLegend (el) {
    return Number(el.className.baseVal.match(/[legend]-(\d)/)[1])
  }

  private getCurrentTextOrRect (el) {
    return Number(el.className.baseVal.match(/[text|rect]-(\d)/)[1])
  }

  private handleClick = (e) => {
    const target = e.target
    const parent = target.parentNode
    const index = this.getCurrentLegend(parent)
    const disactive = !!~parent.className.baseVal.search('disactive')
    this.legendStore[index].disactive = !this.legendStore[index].disactive
    const newPieDate = [...this.legendStore].filter((d) => {
      return !d.disactive
    })
    setTimeout(() => {
      this.store.dispatch(changePieData(newPieDate))
    }, 100)
  }

  private move () {
    const self = this
    /*
     * way 1:注册多个事件
     */
    // selectAll((self as any).legendNodes)
    //   .on('mouseover', function () {
    //     self.store.dispatch(changeCurrentPie(self.getCurrentLegend(this), 'over'))
    //   }).on('mouseout', () => {
    //     self.store.dispatch(changeCurrentPie(-1, 'out'))
    //   })
    /*
     * way 2：事件委托
     */
    selectAll('.legend')
      .on('mouseover', function () {
        event.stopPropagation()
        const target = event.target
        const relate = event.relatedTarget
        if (!relate) {
          return
        }
        if (relate.nodeName === 'svg' && (target.nodeName === 'text' || target.nodeName  === 'rect')) {
          self.store.dispatch(changeCurrentPie(self.getCurrentTextOrRect(target), 'over'))
        }
      })
      .on('mouseout', function () {
        event.stopPropagation()
        self.store.dispatch(changeCurrentPie(-1, 'out'))
      })
  }
}
