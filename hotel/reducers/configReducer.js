/**
 * Created by haosha on 16/10/20.
 */

import * as types from '../actions/actionTypes';

const initialState = {
    limit: 6,
    seconds: 2
};

export default function configReducer(state = initialState, action = {}) {
    switch (action.type) {
        case types.GET_HOTEL_REFRESH_TIMES:
            return action.config;
        default :
            return state;
    }
}

export function detailConfig(state = initialState, action = {}) {
    switch (action.type) {
        case types.GET_HOTEL_DETAIL_REFRESH_TIMES:
            return action.detailConfig;
        default :
            return state;
    }
}

