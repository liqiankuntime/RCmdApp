/**
 * Created by haosha on 16/10/17.
 */
import { combineReducers } from 'redux';
import hotels from './hotelsListReducer';
import search from './searchReducer';
import brand from './brandReducer';
import detail from './hotelDetailReducer';
import order from './orderReducer';
import config from './configReducer';
import {detailConfig} from './configReducer'
import * as types from '../actions/actionTypes';

const initialState= 'Entry';
function initial(state = initialState, action={}) {
    if (action.type == types.DEFINE_INITIAL_COMP)
        return action.comp ? action.comp : state;
    return state;
}
export default rootReducer = combineReducers({
    initial,
    search,
    hotels,
    brand,
    detail,
    order,
    config,
    detailConfig,
});