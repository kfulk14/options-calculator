import React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

let GrantDate = (props) => (
	<DatePicker
		className="form-control grant-date-input"
		selected={props.date}
		onChange={props.onChange} />
);

export default connect(
	function mapStateToProps(state, ownProps) {
		return {
			date: ownProps.grant.grantDate ? moment(ownProps.grant.grantDate) : null
		}
	},
	function mapDispatchToProps(dispatch, ownProps) {
		return {
			onChange: (date) => {
				dispatch({
					type: 'UPDATE_GRANT',
					id: ownProps.grant.id,
					property: 'grantDate',
					value: +date
				});
			}
		};
	}
)(GrantDate);
