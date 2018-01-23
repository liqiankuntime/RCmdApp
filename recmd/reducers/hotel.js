/**
 * Created by haosha on 16/10/27.
 */

import * as Actions from '../actions/types';
import { MessageBox } from '../../common/utils';

function update_hotel_item(state, action) {
    if (action.id == state.id) {
        const hotelState = state.hotel;
        const item = action.item;
        const hotel = {...hotelState, ...item};
        return {...state, hotel};
    }
    return state;
}

function submit_hotel_order(state, action) {
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

export default function hotelReducer(state = {}, action = {}) {
    switch (action.type) {
        case Actions.UPD_HOTEL_ITEM:
            return update_hotel_item(state, action);
        case Actions.SUBMIT_HOTEL:
            return submit_hotel_order(state, action);
        default :
            return state;
    }
}