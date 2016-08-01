import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Grant from './Grant';

let GrantTable = React.createClass({
	render() {
		return (
			<div className="grants">
				<table>
					<thead className="grant-labels">
					<tr>
						<th></th>
						<th className="grant-cell">Grant Date</th>
						<th className="grant-cell"># of Options</th>
						<th className="grant-cell">Vesting Months</th>
						<th className="grant-cell">Vesting Cliff</th>
					</tr>
					</thead>
					<tbody className="grant-list">
					{_.map(this.props.grants, (grant, i) => (
						<Grant key={grant.id} grant={grant} index={i}/>
					))}
					</tbody>
				</table>
			</div>
		);
	}
});

export default connect(
	function mapStateToProps(state) {
		return {
			grants: state.grants
		};
	}
)(GrantTable);
