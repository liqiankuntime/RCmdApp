/**
 * Created by haosha on 16/10/20.
 */

import * as types from '../actions/actionTypes';

const initialState = {
    data: {
        rooms:[]
    },
    loading: false,
};

export default function hotelDetailReducer(state = initialState, action = {}) {
    switch (action.type) {
        case types.FETCH_HOTEL_DETAIL:
            return {...state, data: action.detail};
        case types.SHOW_HOTEL_DETAIL_LOADING:
            return {...state, loading: action.visible};
        default:
            return state;
    }
}