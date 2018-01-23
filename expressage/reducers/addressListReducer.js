/**
 * Created by lc on 17/03/10.
 */
import * as types from '../actions/actionTypes';

const initialState = {
    data:[],
    pageIndex: 0,
    pageSize: 15,
    
    isLoading: false,
    isLoadMore: false,
    isRefreshing: false
};

let addressListReducer = (state = initialState, action = {}) => {
    let data = [];
    switch (action.type) {
        case types.ADDRESS_UPDATE_REQUEST_STATUS:
            return Object.assign({}, state, {
                isLoading: action.isLoading,
                isLoadMore: action.isLoadMore,
                isRefreshing: action.isRefreshing,
            });
        case types.ADDRESS_UPDATE_VIEW_DATA:
            if(!action.data){
                action.data = [];
            }
            data = action.data;
            return {...state, data, isLoadMore: false, isLoading: false, isRefreshing: false,pageIndex: action.pageIndex};
        default:
            return state;
    }
};

export default addressListReducer;