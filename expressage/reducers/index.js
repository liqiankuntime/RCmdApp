/**
 * Created by shane on 17/4/12.
 */
import { combineReducers } from 'redux';
import * as types from '../actions/actionTypes';
import order from './orderReducers';
import orderList from './orderListReducer';
import newOrder from './newOrderReducer';
import address from './addressReducer';

const initialState= 'Entry';
function initial(state = initialState, action={}) {
	if (action.type == types.DEFINE_INITIAL_COMP)
		return action.comp ? action.comp : state;
	return state;
}

export default rootReducer = combineReducers({
	initial,
	order,
	orderList,
    newOrder,
    address,
});