import React from 'react';
import { connect } from 'react-redux';

let GrantInput = (props) => (
	<input
		type="number"
		className={'form-control ' + props.className || ''}
		placeholder={props.placeholder || ''}
		onChange={props.onChange}
		value={props.value}
	/>
);

export default connect(
	function mapStateToProps(state, ownProps) {
		return {
			value: ownProps.grant[ownProps.property] || ''
		}
	},
	function mapDispatchToProps(dispatch, ownProps) {
		return {
			onChange: (e) => {
				dispatch({
					type: 'UPDATE_GRANT',
					id: ownProps.grant.id,
					property: ownProps.property,
					value: +e.target.value || ''
				});
			}
		};
	}
)(GrantInput);
