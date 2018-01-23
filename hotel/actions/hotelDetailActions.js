/**
 * Created by haosha on 16/10/20.
 */

import * as types from './actionTypes';
import {travelUrl, Api, Network, MessageBox} from '../../common/utils';
import Constants from '../common/constants';

export function showDetailLoading(visible) {
    return {
        type: types.SHOW_HOTEL_DETAIL_LOADING,
        visible
    };
}

export function fetchHotelDetail(cityId, cityName, hotelId, searchKey) {
    return (dispatch, getState) => {
        dispatch(showDetailLoading(true));
        const state = getState();
        const {startDate, endDate} = state.search;
        const param = JSON.stringify({cityId, cityName, startDate, endDate, hotelId, searchKey});
        const url = travelUrl + Api.hotel.hotelDetail + '?param=' + param;
        return Network.get(url,
            response => {
                dispatch(showDetailLoading(false));
                dispatch({
                    type: types.FETCH_HOTEL_DETAIL,
                    detail: response
                });
            },
            error => {
                dispatch(showDetailLoading(false));
                MessageBox.error('提示', '查询酒店详细信息失败!', error);
                dispatch({
                    type: types.FETCH_HOTEL_DETAIL,
                    detail: {
                        rooms: []
                    }
                });
            }
        );
    };
}

export function fetchDetailConfig() {
    return (dispatch, getState) => {
        const url = travelUrl + Api.hotel.hotelDetailRefreshtimes
        return Network.get(url, response => {
            let result = response.split('|');
            let data = {limit: result.length >= 1 ? parseInt(result[0]) : 6, seconds: result.length >= 2 ? parseInt(result[1]) : 2};
            dispatch({
                type: types.GET_HOTEL_DETAIL_REFRESH_TIMES,
                detailConfig: data
            });
        }, error => {
            dispatch({
                type: types.GET_HOTEL_DETAIL_REFRESH_TIMES,
                detailConfig: data
            });
        })
    }
}

