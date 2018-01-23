/**
 * Created by lc on 17/03/10.
 */
import * as types from '../actions/actionTypes';

const initialState = {
    list: {
        count: 0,
        data: [],
    },

    pageIndex: 0,
    pageSize: 15,
    
    isLoading: false,
    isLoadMore: false,
    isRefreshing: false,

    login:false,
    message:'您还没有相关的订单!'
    
};

let jdListReducer = (state = initialState, action = {}) => {
    let data = [];
    let list = {};
    switch (action.type) {
        case types.UPDATE_REQUEST_STATUS:
            return Object.assign({}, state, {
                isLoading: action.isLoading,
                isLoadMore: action.isLoadMore,
                isRefreshing: action.isRefreshing,
            });
        case types.JD_RECEIVE_JS:
            return Object.assign({}, state, {
                js: action.js,
            });
        case types.JD_MESSAGE:
            return Object.assign({}, state, {
                message: action.message,
                isLoading: false,
                isLoadMore: false,
                isRefreshing: false
            });
        case types.JD_LOGIN:
            if(state.login != action.login) {
                return Object.assign({}, state, {
                    login: action.login,
                    jd:(action.login?'':state.js)
                });
            }
        case types.UPDATE_VIEW_DATA:
            if(!action.data){
                action.data = [];
            }
            if(action.pageIndex != 1 && action.pageIndex == state.pageIndex){//重复请求
                return {...state, isLoadMore: false, isLoading: false, isRefreshing: false};
            }
            console.log(action.filter);
            console.log(action.data);
            if(action.filter) {
                for (let detail of action.data) {
                    if (action.filter.indexOf(detail.orderId) > -1){
                        detail.isbesweeped = false;
                    } else{
                        detail.isbesweeped = true;
                    }
                }
            }
            data = action.pageIndex == 1 ? action.data : [...state.list.data, ...action.data];
            if(action.pageIndex == 1){
                state.list.data = [];
            }

            list = {...state.list, data};

            return {...state, list, isLoadMore: false, isLoading: false, isRefreshing: false,pageIndex: action.pageIndex};
        default:
            return state;
    }
};

export default jdListReducer;