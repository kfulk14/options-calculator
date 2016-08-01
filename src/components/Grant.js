import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import GrantDate from './GrantDate';
import GrantInput from './GrantInput';

let Grant = (props) => (
	<tr className="grant">
		<td>
			{_.size(props.grant) > 1 && props.grant.id
				? <span className="grant-remove" onClick={props.onRemove}>&times;</span>
				: null}
			<h5>Grant {props.index + 1}</h5>
		</td>
		<td className="grant-cell">
			<div className="input-group grant-date">
				<GrantDate grant={props.grant}/>
			</div>
		</td>
		<td className="grant-cell">
			<div className="input-group grant-num">
				<GrantInput grant={props.grant} property="numOptions" className="grant-num-input" placeholder="100"/>
			</div>
		</td>
		<td className="grant-cell">
			<div className="input-group grant-months">
				<GrantInput grant={props.grant} property="vestingMonths" className="grant-months-input" placeholder="48"/>
			</div>
		</td>
		<td className="grant-cell">
			<div className="input-group grant-cliff">
				<GrantInput grant={props.grant} property="vestingCliff" className="grant-cliff-input" placeholder="12"/>
			</div>
		</td>
	</tr>
);

export default connect(
	null,
	function mapDispatchToProps(dispatch, ownProps) {
		return {
			onRemove: () => {
				dispatch({
					type: 'REMOVE_GRANT',
					id: ownProps.grant.id
				});
			}
		};
	}
)(Grant);
