/**
 * Created by jack on 17/4/10.
 */
import * as types from './actionTypes';
import {travelUrl,baseUrl, Api, Network, MessageBox } from '../../common/utils';
import {Alert,Platform} from 'react-native';
export let fetchAddressList = (isLoadMore, isRefreshing, isLoading)=> {
    return (dispatch, getState) => {
        // dispatch(updateAddressRequestStatus(isLoadMore, isRefreshing, isLoading));//更新界面状态 loading状态
        const state = getState().addressList;
        const url = travelUrl + Api.expressage.staffaddresslist;
        // increase page index
        // dispatch(resetPageIndex(pageIndex));

        return Network.get(url,
            response => {
                console.log("查询列表数据成功!" + response);
                MessageBox.error('提示', '查询列表数据成功!', response);
                dispatch(updateAddressViewData(response));
            },
            error => {
                console.log("查询列表数据失败!" + error);
                MessageBox.error('提示', '查询列表数据失败!', error);
                dispatch(updateAddressViewData([]));
            }
        );
    };
};
export let updateAddressRequestStatus = (isLoadMore, isRefreshing, isLoading)=> {
    return {
        type: types.ADDRESS_UPDATE_REQUEST_STATUS,
        isLoadMore: isLoadMore,
        isRefreshing: isRefreshing,
        isLoading: isLoading,
    };
};

export let updateAddressViewData= (data)=> {
    return {
        type: types.ADDRESS_UPDATE_VIEW_DATA,
        data: data,
    };
};