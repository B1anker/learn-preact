import { h, Component } from 'preact'
import style from './index.css'
import { select } from 'd3-selection'

export default class Tooltip extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
    this.dictionary = {
      a: 'title',
      b: 'name',
      c: 'value',
      d: 'rate'
    }
    this.tooltip = null
  }

  get serie() {
    return this.props.serie
  }

  get name() {
    return this.serie.data[this.props.index].name
  }

  get amount() {
    return this.serie.data.reduce((prev, next) => {
      return prev + next.value
    }, 0)
  }

  get value() {
    return this.serie.data[this.props.index].value
  }

  get rate() {
    return (this.value / this.amount * 100).toFixed(2)
  }

  get left () {
    return this.props.position[0] + this.props.offset.left + 20
  }

  get top () {
    return this.props.position[1] + this.props.offset.top + 20
  }

  move () {
    select(this.tooltip)
      .transition()
      .duration(30)
      .style('transform', `translate(${this.left}px, ${this.top}px)`);
  }

  componentWillReceiveProps (props) {
    this.move()
  }

  render(props, state) {
    return (
      <div className={`${style['h3-tooltip']} ${this.props.visible ? '' : 'h3-hidden'}`} 
        dangerouslySetInnerHTML={{
          __html:
          this.props.formatter.replace(/{(\w)}/g, ($1, $2) => {
            switch (this.dictionary[$2]) {
              case 'title':
                return this.serie.title;
              case 'name':
                return this.serie.data[this.props.index].name;
              case 'value':
                return this.serie.data[this.props.index].value;
              case 'rate':
                return this.rate;
            }
          })
        }}
        ref={(node) => this.tooltip = node}>
      </div>
    )
  }
}