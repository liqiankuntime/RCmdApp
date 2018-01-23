/**
 * Created by jack on 17/4/10.
 */
import * as types from './actionTypes';
import {travelUrl,baseUrl, Api, Network, MessageBox } from '../../common/utils';
import {Alert,Platform} from 'react-native';
export let fetchOrderList = (isLoadMore, isRefreshing, isLoading)=> {
    return (dispatch, getState) => {
        dispatch(updateRequestStatus(isLoadMore, isRefreshing, isLoading));//更新界面状态 loading状态
        const state = getState().orderList;
        const pageIndex = isRefreshing?1:state.pageIndex + 1;
        const query = {
            pagenum:pageIndex,
            perpage:state.pageSize
        };
        const param = JSON.stringify(query);
        const url = travelUrl + Api.expressage.orderList + '?param=' + param ;
        // increase page index
        // dispatch(resetPageIndex(pageIndex));

        return Network.get(url,
            response => {
                console.log("查询列表数据成功!" + response);
                // MessageBox.error('提示', '查询列表数据成功!', response);
                dispatch(updateViewData(response, pageIndex));
            },
            error => {
                console.log("查询列表数据失败!" + error);
                // MessageBox.error('提示', '查询列表数据失败!', error);
                dispatch(updateViewData([],pageIndex - 1));
            }
        );
    };
};
export let updateRequestStatus = (isLoadMore, isRefreshing, isLoading)=> {
    return {
        type: types.LIST_UPDATE_REQUEST_STATUS,
        isLoadMore: isLoadMore,
        isRefreshing: isRefreshing,
        isLoading: isLoading,
    };
};

export let updateViewData= (data,pageIndex)=> {
    return {
        type: types.LIST_UPDATE_VIEW_DATA,
        data: data,
        pageIndex: pageIndex,
    };
};