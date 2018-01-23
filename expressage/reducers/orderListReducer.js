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

let orderListReducer = (state = initialState, action = {}) => {
    let data = [];
    switch (action.type) {
        case types.LIST_UPDATE_REQUEST_STATUS:
            return Object.assign({}, state, {
                isLoading: action.isLoading,
                isLoadMore: action.isLoadMore,
                isRefreshing: action.isRefreshing,
            });
        case types.LIST_UPDATE_VIEW_DATA:
            if(!action.data){
                action.data = [];
            }
            if(action.pageIndex != 1 && action.pageIndex == state.pageIndex){//重复请求
                return {...state, isLoadMore: false, isLoading: false, isRefreshing: false};
            }
            data = action.pageIndex == 1 ? action.data : [...state.data, ...action.data];
            return {...state, data, isLoadMore: false, isLoading: false, isRefreshing: false,pageIndex: action.pageIndex};
        default:
            return state;
    }
};

export default orderListReducer;