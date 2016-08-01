import React, { Component } from 'react';
import './App.css';

import Chart from './components/Chart';
import NumericInput from './components/NumericInput';
import GrantTable from './components/GrantTable';
import Footer from './components/Footer';

class App extends Component {
	render() {
		return (
			<div>
				<div className="wrapper">
					<div className="header">
						<h1>How much are my options&nbsp;worth?</h1>
						<p>The calculator that gives you a totally inaccurate estimate of how much those shiny new employee stock options might be worth someday</p>
					</div>
					<Chart/>
					<div className="single-values">
						<form className="form-inline">
							<div className="form-group">
								<label>
									<span>Hypothetical Valuation</span>
									<NumericInput property="valuation" className="valuation"/>
								</label>
							</div>
							<div className="form-group">
								<label>
									<span># of Fully Diluted Shares</span>
									<NumericInput property="fullyDiluted" className="diluted"/>
								</label>
							</div>
						</form>
					</div>
					<GrantTable/>
				</div>
				<Footer/>
			</div>
		);
	}
}

export default App;
