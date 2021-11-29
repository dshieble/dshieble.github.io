import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import $ from 'jquery';

// https://react-google-charts.com/line-chart
import Chart from "react-google-charts";
import Select from 'react-select'
import moment from 'moment';


// function getData() {
// 	// Fetch data from the backend to plot
	

// }






// TODO: Use the selected ticker to also change the selected graph data and then re-render the graph accordingly 

const PREDICTION_ENDPOINT = "https://backend.danshiebler.com/prediction";
const COMPARABLE_DATE_FORMAT = "YYYYMMDD"
const DEFAULT_TICKER = null
const DEFAULT_GRAPH_DATA = [[new Date(2020, 1, 1), 0, null]]
const HISTORICAL = "historical"
const PREDICTIONS = "predictions"

function Graph(props) {
	console.log("props.graph_data")
	console.log(props.graph_data)

	var out;
	if (props.ticker) {
		const data = [[
		  { type: 'date', label: 'Day' },
		  'Closing Price for ' + props.ticker,
		  'Predicted Closing Price for ' + props.ticker
			]].concat(props.graph_data)

		console.log("data")
		console.log(data)


		out =	<Chart
			  width={'100%'}
			  height={'500'}
			  chartType="Line"
			  loader={<div>Loading Chart</div>}
			  data={data}
			  options={{
			    chart: {
			      title:
			        "Historical and Predicted Closing Prices for " + props.ticker,
			    },
			    width: 900,
			    height: 500,
			    series: {
						0: { color: '#e2431e' },
						1: { color: '#1c91c0' },
			    },
			    axes: {
			      // Adds labels to each axis; they don't have to match the axis names.
			      y: {
			        Price: { label: 'Closing Price' },
			        // Daylight: { label: 'Daylight' },
			      },
			    },
			  }}
			  rootProps={{ 'data-testid': '4' }}
			/>
	} else {
		console.log("showing nothing")
		out = null
	}
	return out;
}


// function getDataFromAPI() {

// 	// return {
// 	// 	"historical": {
// 	// 			"DJI": {
// 	// 				"20200101": 0.5,
// 	// 				"20200102": 0.6,
// 	// 				"20200103": 0.7,
// 	// 				"20200104": 0.8,
// 	// 				"20200105": 1.0,
// 	// 				"20200106": 1.2,
// 	// 			},
// 	// 			"AMD": {
// 	// 				"20200101": 2.5,
// 	// 				"20200102": 2.6,
// 	// 				"20200103": 2.3,
// 	// 				"20200104": 2.8,
// 	// 				"20200105": 4.0,
// 	// 				"20200106": 4.2,
// 	// 			}
// 	// 		},
// 	// 	"predicted": {
// 	// 			"DJI": {
// 	// 				"20200107": 1.4
// 	// 			},
// 	// 			"AMD": {
// 	// 				"20200107": 3.9
// 	// 			}
// 	// 		}
// 	// }
// }


function getGraphDataFromTicker(raw_data, tr) {

	console.log("getGraphDataFromTicker - raw_data")
	console.log(raw_data)

	const dates = Object.keys(raw_data[HISTORICAL][tr]).concat(
		Object.keys(raw_data[PREDICTIONS][tr])
	)

	const historical_dates = Object.keys(raw_data[HISTORICAL][tr])
	const last_historical_date = historical_dates[historical_dates.length - 1]
	const predicted_dates = Object.keys(raw_data[PREDICTIONS][tr])


	var graph_data = new Array()
	graph_data = graph_data.concat(historical_dates.map(date => (
	  [moment(date, COMPARABLE_DATE_FORMAT).toDate(), raw_data[HISTORICAL][tr][date], null]
	)))

	// We need to start the predicted line to overlap with the historical line, so we duplicate this point
	graph_data.push(
		[moment(last_historical_date, COMPARABLE_DATE_FORMAT).toDate(),
		raw_data[HISTORICAL][tr][last_historical_date],
		raw_data[HISTORICAL][tr][last_historical_date]]
	)

	graph_data = graph_data.concat(predicted_dates.map(date => (
	  [moment(date, COMPARABLE_DATE_FORMAT).toDate(), null, raw_data[PREDICTIONS][tr][date]]
	)))

  return graph_data
 }

class Screen extends React.Component {
  "use strict"

  constructor(props) {
    super(props);
    this.raw_data = null
    this.tickers = null;
		this.state = {
    	response: null,
    	ticker: null,
    	graph_data: null
    }
    this.loadDataFromAPI(this)
  }

  loadDataFromAPI(screen) {
		// We only need to hit the backend to fetch data if the graph data is none
		if (!screen.state.graph_data) {


			// Start with a get query to get the 


			console.log("Pulling data")
			const request_data = "date=today&label_column=Close";

			// TODO: Change this to get the next weekday after the specified date.

			console.log("request_data")
			console.log(request_data)

			$.post(
				PREDICTION_ENDPOINT,
				request_data,
				function(response) {
					console.log("Received response, setting variables")
					console.log(response)
					screen.raw_data = response["data"]
					screen.tickers = Object.keys(screen.raw_data["historical"])
			    screen.setState({
			    	response: null,
			    	ticker: screen.tickers[0],
			    	graph_data: getGraphDataFromTicker(screen.raw_data, screen.tickers[0])
			    })
			    screen.render()
				},
				'json'
			)
		} else {
			console.log("Not pulling new data")
		}
  }

  handleSelectChange(selected_ticker) {
    this.setState({
    	response: this.state.response,
    	ticker: selected_ticker.value,
    	graph_data: getGraphDataFromTicker(this.raw_data, selected_ticker.value)
  	})
  }

  renderGraph() {

    return <Graph
        ticker={this.state.ticker}
        graph_data={this.state.graph_data}
        />;
  }

  renderSelect() {
  	var out = null;
  	if (this.tickers) {
			// https://www.npmjs.com/package/react-select
	 	  const options = this.tickers.map(ticker => (
				  { value: ticker, label: ticker }
			))
	  	out = <Select 
	  		options={options}
	  		onChange={
	  			// NOTE: We build an anonymous function here so that `this` is still available inside of handleSelectChange
	  			(selected_ticker) => this.handleSelectChange(selected_ticker)}
	  	/>;

	  	console.log(out)
  	}
	  return out;
  }


  render() {
  	// NOTE: The render method is called each time the state is updated
    console.log("rendering");
    return (
      <div>
        <div className="graph">
          {this.renderGraph()}
        </div>
        <div className="select">
          {this.renderSelect()}
        </div>
      </div>
    );
  }
}





// class Graph extends React.Component {
//   "use strict"

//   render() {
//     console.log("rendering graph");
//     return (

//       <div>

//       </div>
//     );
//   }
// }


// ========================================

ReactDOM.render(
  <Screen />,
  document.getElementById('root')
);
