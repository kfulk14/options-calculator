import React from 'react';
import { connect } from 'react-redux';

let ValuationInput = (props) => (
	<input
		type="number"
		value={props.value}
		onChange={props.onChange}
		className={'form-control ' + (props.className || '')}
		/>
);

export default connect(
	function mapStateToProps(state, ownProps) {
		return {
			value: state[ownProps.property] || ''
		};
	},
	function mapDispatchToProps(dispatch, ownProps) {
		return {
			onChange: (e) => {
				dispatch({
					type: 'SET_NUMERIC_PROPERTY',
					property: ownProps.property,
					value: e.target.value
				});
			}
		};
	}
)(ValuationInput);
