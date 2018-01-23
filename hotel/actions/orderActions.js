/**
 * Created by haosha on 16/10/21.
 */

import {onRefreshHotelList} from '../../native'
import {Alert,Platform} from 'react-native';
import * as types from './actionTypes';
import {travelUrl, Api, Network, MessageBox } from '../../common/utils';
import Constants from '../common/constants';

export function getRatePlanDetail(cityId,cityName,hotelId,roomTypeId,ratePlanId) {
    return (dispatch, getState) => {
        dispatch(showOrderLoading(true,false));
        const state = getState();
        const {startDate,endDate} = state.search;
        const param = JSON.stringify({cityId, cityName, startDate, endDate, hotelId, roomTypeId, ratePlanId});
        const url = travelUrl + Api.hotel.hotelDetail + '?param=' + param;
        return Network.get(url,
            response => {
                //alert(JSON.stringify(response))
                dispatch(showOrderLoading(false,false));
                dispatch({
                    type: types.GET_RATEPLAN_DETAIL,
                    data: response
                });
            },
            error => {
                dispatch(showOrderLoading(false,false));
                dispatch({
                    type: types.CREATE_HOTEL_ORDER,
                    hotelId:hotelId,
                    ratePlanId:ratePlanId,
                });
                //MessageBox.error('提示', '查询酒店房型信息失败!', error);
            });
    };
}

export function createOrder(hotelId,ratePlanId) {
    return {
        type: types.CREATE_HOTEL_ORDER,
        hotelId:hotelId,
        ratePlanId:ratePlanId
    };
}

export function updateOrder(data) {
    return {
        type: types.UPDATE_HOTEL_ORDER,
        data
    };
}

export function  updateOrderDetail(detail) {
    return {
        type: types.UPDATE_HOTEL_DETAIL,
        detail
    }
}

export function showOrderLoading(viewVisible,modalVisible) {
    return {
        type: types.SHOW_HOTEL_ORDER_LOADING,
        viewLoading:viewVisible,
        modalLoading:modalVisible,
    };
}
export function getOrder(pk) {
    return dispatch => {
        dispatch(showOrderLoading(true, false));
        const url = travelUrl + Api.hotel.order + pk;
        return Network.get(url,
            response => {
                dispatch(showOrderLoading(false, false));
                dispatch({
                    type: types.GET_HOTEL_ORDER,
                    data: response
                });
            },

            error => {
                dispatch(showOrderLoading(false, false));
                MessageBox.error('提示', '查询酒店订单信息失败!', error);
                dispatch({
                    type: types.GET_HOTEL_ORDER,
                    data: null
                })
            });
    }
}


export function submitOrder(param) {
    return dispatch => {
        Platform.OS=='ios'? dispatch(showOrderLoading(false,true)):dispatch(showOrderLoading(true,false));
        const url = travelUrl + Api.hotel.createOrder;
        return Network.post(url, param,
            respnse => {
                dispatch(showOrderLoading(false, false));
                dispatch({
                    type: types.SUBMIT_HOTEL_ORDER,
                    data: respnse
                })
            },
            error => {
                dispatch(showOrderLoading(false, false));
                MessageBox.error('提示', '提交酒店订单失败!', error);
            }
        )
    }
}

export function confirmOrder() {

}

export function cancelOrder(pk) {
    return dispatch => {
        Platform.OS=='ios'? dispatch(showOrderLoading(false,true)):dispatch(showOrderLoading(true,false));
        const url = travelUrl + Api.hotel.cancelOrder + pk;
        return Network.get(url,
            respnse => {
                if (onRefreshHotelList){
                    onRefreshHotelList();
                }
                dispatch(showOrderLoading(false, false));
                dispatch({
                    type: types.CANCEL_HOTEL_ORDER,
                    data:{orderStatus: '已取消'}
                })
            },
            error => {
                dispatch(showOrderLoading(false, false));
                MessageBox.error('提示', '取消酒店订单失败!', error);
            }
        )
    }
}