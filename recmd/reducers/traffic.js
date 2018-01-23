/**
 * Created by haosha on 16/9/1.
 */

import * as Actions from '../actions/types';
import {mergeFromAndTo} from '../common/comm';

function update_traffic_item(state, action) {
    if (action.id == state.id) {
        const selected = state[action.selected];
        const item = mergeFromAndTo(selected, action.item);
        return {
            ...state,
            [action.selected]: item
        };
    }
    return state;
}

function submit_traffic_order(state, action) {
    if (action.id == state.id) {
        const selected = state[action.selected];
        const item = action.item;
        return {
            ...state,
            [action.selected]: {...selected, ...item},
            enabled: false,
            status: action.status,
            statusText: action.statusText,
            orderId: action.orderId
        };
    }
    return state;
}

export default (state = {}, action = {}) => {
    switch (action.type) {
        case Actions.UPD_TRAFFIC_ITEM:
            return update_traffic_item(state, action);
        case Actions.SUBMIT_TRAFFIC:
            return submit_traffic_order(state, action);
        default:
            return state;
    }
}