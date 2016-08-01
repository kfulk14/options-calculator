import React from 'react';
import _ from 'lodash';
import Highcharts from 'highcharts';
import { connect } from 'react-redux';

Highcharts.setOptions({
	lang: {
		thousandsSep: ","
	}
});

function addMonthsToDate(date, months) {
	return new Date(date.getFullYear(), date.getMonth() + months);
}

function isGrantCompleted(g) {
	return g.grantDate !== undefined
		&& g.numOptions !== undefined
		&& g.vestingMonths !== undefined
		&& g.vestingCliff !== undefined;
}

let CHART_COLOR = '#FFA400';

let Chart = React.createClass({
	componentDidMount() {
		this.updateChart = _.debounce(this.updateChart, 100);

		let data = this.getData();

		this.chart = new Highcharts.Chart({
			chart: {
				renderTo: 'chart-div',
				zoomType: 'x',
				animation: false,
				backgroundColor: 'transparent',
				style: {
					fontFamily: '"Open Sans", Helvetica Neue, sans-serif'
				}
			},
			labels: {
				style: {
					color: '#ffffff',
				},
			},
			title: false,
			xAxis: {
				gridLineColor: 'rgba(255,255,255,0.3)',
				gridLineDashStyle: 'Dash',
				gridLineWidth: 1,
				tickLength: 0,
				lineWidth: 0,
				type: 'datetime',
				tickColor: "#ffffff",
				title: false,
				labels: {
					style: {
						color: '#ffffff',
					},
				},
			},
			yAxis: [{
				offset: -5,
				gridLineColor: 'rgba(255,255,255,0.3)',
				gridLineDashStyle: 'Dash',
				tickColor: "#ffffff",
				title: false,
				min: 0,
				labels: {
					formatter: function(){
						let val = this.value;
						if (val >= 1e12) {
							return '$' + val / 1e12 + 'T';
						} else if (val >= 1e9) {
							return '$' + val/1e9 + 'B';
						} else if (val >= 1e6) {
							return '$' + val/1e6 + 'M';
						} else if (val >= 1e3) {
							return '$' + val/1e3 + 'K';
						}
						return '$' + val;
					},
					style: {
						color: '#ffffff',
					},
				},
			}, {
				opposite: true,
				gridLineWidth: 0,
				tickColor: "#ffffff",
				title: false,
				min: 0,
				minPadding: 0.9,
				maxPadding: 0.9,
				labels: {
					formatter: function(){
						let val = this.value;
						if (val >= 1e12) {
							return val / 1e12 + 'T';
						} else if (val >= 1e9) {
							return val/1e9 + 'B';
						} else if (val >= 1e6) {
							return val/1e6 + 'M';
						} else if (val >= 1e3) {
							return val/1e3 + 'K';
						}
						return val;
					},
					style: {
						color: '#ffffff',
					},
				},
			}],
			tooltip: {
				backgroundColor: '#0A4567',
				borderWidth: 0,
				borderRadius: 4,
				shadow: false,
				valueDecimals: 2,
				valuePrefix: '$',
				xDateFormat: '%B %e, %Y',
				headerFormat: '<span style="font-size:12px;">{point.key}</span><br/>',
				pointFormat: '<span style="font-size:18px;">{point.y}</span><br/>',
				style: {
					color: '#fff',
					padding: '12px',
				},
			},
			credits: {
				enabled: false
			},
			legend: {
				itemStyle: {color: '#ffffff'},
				itemHoverStyle: {color: '#dddddd'}
			},
			plotOptions: {
				area: {
					color: CHART_COLOR,
					fillColor: {
						linearGradient: {
							x1: 0,
							y1: 0,
							x2: 0,
							y2: 1
						},
						stops: [
							[0, Highcharts.Color(CHART_COLOR).setOpacity(0.5).get('rgba')], // eslint-disable-line new-cap
							[1, Highcharts.Color(CHART_COLOR).setOpacity(0).get('rgba')]    // eslint-disable-line new-cap
						]
					},
					marker: {
						radius: 0
					},
					lineWidth: 2,
					states: {
						hover: {
							lineWidth: 1
						}
					},
					step: 'left',
					threshold: null
				},
				line: {
					lineWidth: 2,
					step: 'left',
					marker: {
						radius: 0
					},
					threshold: null,
					tooltip: {
						valueDecimals: 0,
						valuePrefix: ''
					},
				},
			},

			series: [{
				type: 'line',
				yAxis: 1,
				name: 'Total Options Vested',
				data: data.options || []
			}, {
				type: 'area',
				name: 'Estimated Value',
				data: data.value
			}]
		});

	},

	getData() {
		// First get grants that have been filled out
		let grants = this.props.grants;
		let validGrants = [];
		_.each(grants, function(g){
			if (isGrantCompleted(g)) {
				validGrants.push(g);
			}
		});

		if (!validGrants.length) {
			return this.getDefaultData();
		}

		// Next check grants
		let vestDates = [];
		_.each(validGrants, function(g){
			let grantDate = new Date(g.grantDate);
			vestDates.push([+grantDate, 0]);
			for (let j = 1; j <= g.vestingMonths; j++) {
				if (j < g.vestingCliff) {
					continue;
				}
				let vestDate = +addMonthsToDate(grantDate, j);
				if (j === g.vestingCliff) {
					vestDates.push([vestDate, (g.vestingCliff / g.vestingMonths) * g.numOptions]);
				} else {
					vestDates.push([vestDate, (1 / g.vestingMonths) * g.numOptions]);
				}
			}
		});

		// Sort vest dates
		vestDates.sort(function(a, b){
			return a[0] - b[0];
		});

		// Compute cumulative values
		let data = [];
		let optionsData = [];
		let date;
		let total = 0;
		let totalVested = 0;
		let optionsVested;
		for (let i = 0; i < vestDates.length; ) {
			date = vestDates[i][0];
			while(vestDates[i] && vestDates[i][0] === date) {
				optionsVested = vestDates[i][1];
				totalVested += optionsVested;
				total += (optionsVested / this.props.fullyDiluted) * this.props.valuation;
				i++;
			}
			data.push([date, total]);
			optionsData.push([date, totalVested]);
		}
		if (!data.length) {
			return this.getDefaultData();
		}
		return {
			value: data,
			options: optionsData
		};
	},

	getDefaultData() {
		let now = new Date();
		let data = [];
		for (let i = 0; i <= 4; i++) {
			data.push([+(new Date(now.getFullYear() + i, 0)), 0]);
		}
		return {
			value: data,
			options: []
		};
	},

	updateChart() {
		var data = this.getData();
		this.chart.series[0].setData(data.options || [], true);
		this.chart.series[1].setData(data.value, true);
	},

	componentWillReceiveProps(nextProps) {
		this.updateChart();
	},

	shouldComponentUpdate() {
		// We'll handle updates ourself
		return false;
	},

	render() {
		return (
			<div className="chart">
				<div id="chart-div"></div>
			</div>
		);
	}

});


export default connect(
	function mapStateToProps(state) {
		return {
			grants: state.grants,
			valuation: state.valuation,
			fullyDiluted: state.fullyDiluted,
		}
	}
)(Chart);
