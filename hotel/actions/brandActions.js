/**
 * Created by haosha on 16/10/20.
 */

import * as types from './actionTypes';
import {travelUrl, Api, Network, MessageBox } from '../../common/utils';
import Constants from '../common/constants';
import { showHotelsLoading } from './hotelsListActions';

export function fetchBrands() {
    return (dispatch, getState) => {
        //dispatch(showHotelsLoading(true));
        const search = getState().search;
        const url = travelUrl + Api.hotel.brands + search.cityId;
        return Network.get(url,
            response => {
                //dispatch(showHotelsLoading(false));
                dispatch({
                    type: types.GET_HOTEL_BRANDS,
                    brands: response
                });
            },
            error => {
                dispatch(showHotelsLoading(false));
                MessageBox.error('提示', '查询品牌信息失败!', error);
            }
        );
    };
}
