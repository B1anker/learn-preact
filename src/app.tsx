import { Component, h  } from 'preact'
import { connect } from 'preact-redux'
import PieChart from './charts/pie-chart'
import PieChartOptions from './options/pie-chart'
import * as actions from './store/actions'
import reducers from './store/reducers/index'
import { bindActions } from './store/util'
import './utils/transition'

@connect(reducers, bindActions(actions))
export default class App extends Component<any, any> {
  public render () {
    return (
      <div>
        <PieChart {...PieChartOptions}/>
      </div>
    )
  }
}
