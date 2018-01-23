/**
 * Created by jack on 17/3/10.
 */
import * as types from './actionTypes';
import {travelUrl,baseUrl, Api, Network, MessageBox } from '../../common/utils';
import {Alert,Platform} from 'react-native';
export let fetchJDList = (isLoadMore, isRefreshing, isLoading)=> {
    return (dispatch, getState) => {
        dispatch(updateRequestStatus(isLoadMore, isRefreshing, isLoading));//更新界面状态 loading状态
        const state = getState().search;
        const pageIndex = state.pageIndex + 1;
        const search = {...state, pageIndex};
        const param = JSON.stringify(search);
        const url = travelUrl + Api.orderform;
        // increase page index
        // dispatch(resetPageIndex(pageIndex));

        return Network.get(url,
            response => {

                dispatch(receiveJDList(response, pageIndex));
            },
            error => {
                MessageBox.error('提示', '查询酒店列表数据失败!', error);
                dispatch(receiveJDList({
                        count: 0,
                        hotels: []
                    },
                    pageIndex - 1));
            }
        );
    };
};
export let updateRequestStatus = (isLoadMore, isRefreshing, isLoading)=> {
    return {
        type: types.UPDATE_REQUEST_STATUS,
        isLoadMore: isLoadMore,
        isRefreshing: isRefreshing,
        isLoading: isLoading,
    };
};
export let receiveJDList = (data,pageIndex)=> {
    // return {
    //     type: types.UPDATE_VIEW_DATA,
    //     data: data,
    //     pageIndex: pageIndex,
    //     filter: null
    // };
    return (dispatch, getState) => {
        if(Api.orderform.jdFilterList) {
            if (data && data.length > 0) {
                const param = [];
                for (let detail of data) {
                    param.push(detail.orderId);
                }
                const params = {
                    order_ids:param
                };
                const jsonText = JSON.stringify(params);
                console.log(jsonText);
                const url = baseUrl + Api.orderform.jdFilterList + '?param=' + jsonText;
                return Network.get(url,
                    response => {
                        console.log(response);
                        dispatch(viewData(data,pageIndex,response));
                        // dispatch(receiveJDJS('javascript:' + response + '\ngetJDOrderList(1);'));
                    },
                    error => {
                        // MessageBox.error('提示', '查询列表数据失败!http://10.2.128.25:8800/', error);
                        // dispatch(receiveJDJS(''));
                        console.log(error);
                        dispatch(viewData(data,pageIndex,null));
                    }
                );
            } else {
                dispatch(viewData(data,pageIndex,null));
            }
        }else{
            dispatch(viewData(data,pageIndex,null));
        }
    };
};

export let viewData= (data,pageIndex,response)=> {
    return {
        type: types.UPDATE_VIEW_DATA,
        data: data,
        pageIndex: pageIndex,
        filter: response
    };
};



export let updateJDLogin = (login)=> {
    return {
        type: types.JD_LOGIN,
        login: login,
    };
};
export let updateJDMessage = (message)=> {
    return {
        type: types.JD_MESSAGE,
        message: message,
    };
};