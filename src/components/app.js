import { h, Component } from 'preact'
import '../common/initTransition'
import { Provider } from 'preact-redux'
import store from '../store'
import PieChart from '../charts/pieChart'
import PieChartOptions from '../options/pieChart'

export default class App extends Component {
	render () {
		return (
			<div id='app'>
				<Provider store={store}>
					<PieChart {...PieChartOptions}/>
				</Provider>
			</div>
		)
	}
}