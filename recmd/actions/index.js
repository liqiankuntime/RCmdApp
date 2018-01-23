/**
 * Created by haosha on 16/9/1.
 */

import { Alert } from 'react-native';
import * as Actions from '../actions/types';
import * as DATA from './testdata';
import { postEstimate } from '../common/ApiRequest';
import {
    selectItem,
    ITEM_TAXI_TO,
    ITEM_TAXI_FROM
} from '../common/comm';
import NativeModule from '../native/NativeModule';
import { baseUrl, travelUrl, Network, MessageBox, Api } from '../../common/utils';
import {alertShow} from '../../common/Alert'

/*export function loadTrips(param, onSuccss, onError) {
    return dispatch => {
        const promise = Promise.resolve();
        return promise
            .then(() => {
                dispatch({
                    type: Actions.LOAD_ALL,
                    trips: DATA.TRIPS_TEST_DATA
                })
            })
            .then(onSuccss);
    }
}*/

export function loadTrips(param, onSuccess, onError) {
    return dispatch => {
        const url = travelUrl + Api.recmd.intelligent + '?param=' + JSON.stringify(param);
        return Network.get(url, json => {
                dispatch({
                    type: Actions.LOAD_ALL,
                    trips: json
                });
                if (onSuccess)
                    onSuccess();
            },
            error => {
                if (onError)
                    onError(error);
            }
        );
    };
}

export function addTrip(trip) {
    return {
        type: Actions.ADD_TRIP,
        trip
    };
}

export function updateTrip(trip) {
    return {
        type: Actions.UPD_TRIP,
        trip
    };
}

export function updateItem(tripId, id, item) {
    return {
        type: Actions.UPD_ITEM,
        tripId,
        id,
        item
    };
}

export function deleteItem(tripId, id) {
    return {
        type: Actions.DEL_ITEM,
        tripId,
        id
    };
}

export function updateTaxi(tripId, id, taxi) {
    return {
        type: Actions.UPD_TAXI,
        tripId,
        id,
        taxi
    };
}

export function evaluate_taxi_price(tripId, id) {
    return (dispatch, getState) => {
        const state = getState();
        const taxi = selectItem(state, tripId, id);
        if (taxi && (taxi.type == ITEM_TAXI_FROM || taxi.type == ITEM_TAXI_TO)) {
            dispatch(visibleLoading(true));
            const params = {
                slat: taxi.from.latitude,
                slng: taxi.from.longitude,
                elat: taxi.to.latitude,
                elng: taxi.to.longitude,
                serviceId: taxi.pickUpResult.serviceId,
                appointTime: taxi.from.Date + " " + taxi.from.time + ":00",
                //departureTime: "2016-10-12 09:30:00",
                flightNo: taxi.pickUpResult.flightNo,
                flightDelayTime: taxi.type === 3 ? 50 : null,
                flightDate: taxi.type === 3 ? taxi.from.Date + ' ' + taxi.from.time : null,
                airCode: taxi.from.ArriveCityAirportCode,
            };
            return postEstimate(params,
                    json => {
                        dispatch(visibleLoading(false));
                        if (json && json.constructor == Array && json.length) {
                            dispatch({
                                type: Actions.EVL_TAXI_PRICE,
                                tripId,
                                id,
                                carGroups: json
                            });
                        }
                        else if (typeof json == 'string') {
                            alertShow(json)
                        }
                        else {
                            alertShow('服务繁忙,无法获取预估价格!')
                        }
                    },
                    error => {
                        dispatch(visibleLoading(false));
                        MessageBox.error('提示', '服务繁忙,无法获取预估价格!', error);
                    }
            );
        }
        return Promise.reject().catch(() => {
            MessageBox.show('提示', '服务类型错误,无法获取预估价格!');
        });
    };
}

// 长途交通工具日期的变化引发行程变更的接口
// tripId:行程id
// trafficId:变化的长途交通工具id
// trips:影响到的已有行程数组
// 返回值:[trip, trip]
export function recommendTripsByTraffic(tripId, trafficId, trips) {
    return dispatch => {
        dispatch(visibleLoading(true));
        const param = {
            param: {
                tripId,
                trafficId,
                trips
            }
        };
        const jsonText = JSON.stringify(param);
        const url = travelUrl + Api.recmd.changeTicket;
        return Network.post(url, jsonText,
                json => {
                    dispatch(visibleLoading(false));
                    dispatch({
                        type: Actions.RCMD_TRIP,
                        trips: json
                        //items: DATA.RCMD_TAXI_DATA
                    });
                },
                error => {
                    dispatch(visibleLoading(false));
                    MessageBox.debug('重新推荐出现错误!', error);
                }
        );
    };
}

// 更新type为2的select字段对应的数据结构
export function updateTrafficItem(tripId, id, selected, trafficItem) {
    return {
        type: Actions.UPD_TRAFFIC_ITEM,
        tripId,
        id,
        selected,
        item: trafficItem
    };
}

export function switchTrafficTab(tripId, id, code) {
    return (dispatch, getState) => {
        const state = getState();
        const trip = selectItem(state, tripId, id);
        trip.selected = code;
        return Promise.resolve().then(() => {
            dispatch(
                updateTrafficItem(tripId, id,  code, trip)
            );
        });
    };
}

export function submitTrafficOrder(tripId, id, selected, trafficItem, status, orderId, statusText) {
    return {
        type: Actions.SUBMIT_TRAFFIC,
        tripId,
        id,
        selected,
        item: trafficItem,
        status,
        statusText,
        orderId
    };
}

// 更新type为4的hotel字段对应的数据结构
export function updateHotelItem(tripId, id, hotelItem, selected = 'hotel') {
    return {
        type: Actions.UPD_HOTEL_ITEM,
        tripId,
        id,
        item: hotelItem,
        selected
    };
}

export function submitHotelOrder(tripId, id, hotelItem, status, orderId, statusText, selected = 'hotel') {
    return {
        type: Actions.SUBMIT_HOTEL,
        tripId,
        id,
        selected,
        item: hotelItem,
        status,
        statusText,
        orderId
    };
}

export function visibleMoreView(tripId, id, visible) {
    return {
        type: Actions.VISIBLE_MORE,
        tripId,
        id,
        visible
    };
}

export function visibleDelView(tripId, id, visible) {
    return {
        type: Actions.VISIBLE_DEL,
        tripId,
        id,
        visible
    };
}

export function visibleLoading(visible) {
    return {
        type: Actions.VISIBLE_LOADING,
        visible
    };
}