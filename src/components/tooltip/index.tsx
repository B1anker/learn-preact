import { select } from 'd3-selection'
import { Component, h } from 'preact'
import common from '../../style/common.less'
import { SerieItem } from '../pie'
import tooltip from './index.less'

interface TooltipProps {
  formatter: string
  index: number
  serie: SerieItem
  offset: {
    left: number
    top: number
  }
}

interface TooltipState {
  visible: boolean
  position: number[]
  current: number
}

export default class Tooltip extends Component<TooltipProps, TooltipState> {
  private dictionary
  private tooltip: Element

  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      position: [0, 0],
      current: 0
    }
    this.dictionary = {
      a: 'title',
      b: 'name',
      c: 'value',
      d: 'rate'
    }
    this.tooltip = null
  }

  private get store () {
    return this.context.store.getState().pieChart
  }

  private get serie () {
    return this.props.serie
  }

  private get name () {
    return this.serie.data[this.props.index].name
  }

  private get amount () {
    return this.serie.data.reduce((prev, next) => {
      return prev + (next as any).value
    }, 0)
  }

  private get value (): number {
    return this.serie.data[this.props.index].value as number
  }

  private get rate () {
    return (this.value / this.amount * 100).toFixed(2)
  }

  private get left () {
    return this.state.position[0] + this.props.offset.left + 20
  }

  private get top () {
    return this.state.position[1] + this.props.offset.top + 20
  }

  public componentDidMount () {
    this.context.store.subscribe(() => {
      this.setState({
        current: this.store.currentPie,
        visible: this.store.mouseState === 'over',
        position: this.store.mousePosition
      })
      this.handleMove()
    })
  }

  public render (props, state) {
    const current = this.state.current === -1 ? 0 : this.state.current
    return (
      <div className={`${tooltip['h3-tooltip']} ${this.state.visible ? '' : common['h3-hidden']}`}
        dangerouslySetInnerHTML={{
          __html:
          this.props.formatter.replace(/{(\w)}/g, ($1, $2) => {
            switch (this.dictionary[($2)]) {
              case 'title':
                return this.serie.title as string
              case 'name':
                return this.serie.data[current].name as string
              case 'value':
                return this.serie.data[current].value as string
              case 'rate':
                return this.rate as string
            }
          })
        }}
        ref={(node) => this.tooltip = node} />
    )
  }

  private handleMove = () => {
    select(this.tooltip)
      .transition()
      .duration(30)
      .style('transform', `translate(${this.left}px, ${this.top}px)`)
  }
}
