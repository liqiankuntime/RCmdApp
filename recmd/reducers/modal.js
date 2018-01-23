/**
 * Created by haosha on 16/9/12.
 */

import {combineReducers} from 'redux';
import * as Actions from '../actions/types';

const initialState = {
    more:{
        tripId:0,
        id:0,
        visible:false
    },
    del:{
        tripId:0,
        id:0,
        visible:false
    },
    loading: {
        visible: false
    }
};

function more(state = initialState.more, action={}) {
    switch (action.type) {
        case Actions.VISIBLE_MORE:
            return {
                ...state,
                tripId: action.tripId,
                id: action.id,
                visible: action.visible
            };
        default:
            return state;
    }
    return state;
}

function del(state = initialState.del, action={}) {
    switch (action.type) {
        case Actions.VISIBLE_DEL:
            return {
                ...state,
                tripId: action.tripId,
                id: action.id,
                visible: action.visible
            };
        default:
            return state;
    }
    return state;
}

function loading(state = initialState.del, action={}) {
    if (action.type == Actions.VISIBLE_LOADING) {
        return {
            ...state,
            visible:action.visible
        };
    }
    return state;
}

export default combineReducers({
    more,
    del,
    loading
});
