/**
 * Created by lc on 17/03/10.
 */
import { combineReducers } from 'redux';
import * as types from '../actions/actionTypes';

import jd from './jdListReducer';

const initialState= 'Entry';
function initial(state = initialState, action={}) {
    if (action.type == types.DEFINE_INITIAL_COMP)
        return action.comp ? action.comp : state;
    return state;
}
export default rootReducer = combineReducers({
    initial,
    jd
});