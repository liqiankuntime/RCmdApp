/**
 * Created by shane on 17/4/17.
 */
import * as types from '../actions/actionTypes';

const initialState = {
	loadingView: false,
	loadingModal: false,
	data: null
};

function get_expressageOrder(state, action) {
	return {...state, data:action.data};
}

export default function orderReducer(state=initialState, action={}) {
	switch (action.type) {
		case types.SHOW_EXPRESSAGE_ORDER_LOADING :
			return {...state, loadingModal:action.loadingModal, loadingView:action.loadingView};
		case types.GET_EXPRESSAGE_ORDER :
			return get_expressageOrder(state, action);
		case types.CANCEL_EXPRESSAGE_ORDER:
			return get_expressageOrder(state, action);
		case types.RESET_EXPRESSAGE_ORDER :
			return {...state, data: null};
		default :
			return state;
	}
}
