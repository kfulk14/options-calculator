import { createStore } from 'redux';
import _ from 'lodash';
import uuid from 'node-uuid';

function createGrant(options = {}) {
	return _.assign({}, options, {id: uuid.v4()});
}
function isGrantEmpty(g) {
	return _.size(g) === 1 && g.id;
}
function validateGrantsArray(grants) {
	if (!_.isArray(grants)) {
		grants = [];
	}
	if (!_.find(grants, isGrantEmpty)) {
		grants = grants.concat(createGrant())
	}
	return grants.slice(0);
}

// Create store with main reducer
let store = createStore((state, action) => {
	if (typeof state === 'undefined') {
		state = {};
	}
	let grants = state.grants;
	let index;
	switch (action.type) {
		case 'SET_STATE':
			return action.state;
		case 'SET_NUMERIC_PROPERTY':
			return _.assign({}, state, {[action.property]: +action.value || ''});
		case 'REMOVE_GRANT':
			grants = _.reject(grants, {id: action.id});
			return _.assign({}, state, {grants: validateGrantsArray(grants)});
		case 'UPDATE_GRANT':
			index = _.findIndex(grants, {id: action.id});
			if (action.value) {
				grants[index] = _.assign({}, grants[index], {[action.property]: action.value});
			} else {
				delete grants[index][action.property];
				grants[index] = _.assign({}, grants[index]);
			}
			return _.assign({}, state, {grants: validateGrantsArray(state.grants)});
		default:
			return state;
	}
});

// Load initial state
let DEFAULT_VALUATION = 1000000000;
let DEFAULT_DILUTED = 1000000;
let persisted = window.localStorage.getItem('__state');
persisted = _.isString(persisted) ? JSON.parse(persisted) || {} : {};
store.dispatch({
	type: 'SET_STATE',
	state: {
		grants: validateGrantsArray(persisted.grants),
		valuation: persisted.valuation || DEFAULT_VALUATION,
		fullyDiluted: persisted.fullyDiluted || DEFAULT_DILUTED
	}
});

// Save current state when store changes
store.subscribe(() => {
	window.localStorage.setItem('__state', JSON.stringify(store.getState()));
});

export default store;
