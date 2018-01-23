/**
 * Created by chenty on 2016/10/18.
 * @flow
 */

import * as types from './actionTypes';
import {travelUrl, Api, Network, MessageBox } from '../../common/utils';
import Constants from '../common/constants';
import { resetPageIndex } from './searchActions';

export let fetchHotels = (isLoadMore, isRefreshing, isLoading)=> {
    return (dispatch, getState) => {
        dispatch(fetchHotelsList(isLoadMore, isRefreshing, isLoading));
        const state = getState().search;
        const pageIndex = state.pageIndex + 1;
        const search = {...state, pageIndex};
        const param = JSON.stringify(search);
        const url = travelUrl + Api.hotel.hotelsList + '?param=' + param;
        // increase page index
        dispatch(resetPageIndex(pageIndex));

        return Network.get(url,
            response => {

                dispatch(receiveHotelsList(response, pageIndex));
            },
            error => {
                MessageBox.error('提示', '查询酒店列表数据失败!', error);
                dispatch(receiveHotelsList({
                    count: 0,
                    hotels: []
                    },
                    pageIndex - 1));
            }
        );
    };
};

export let refreshHotels = ()=>{
    return (dispatch, getState)=>{
        const search = getState().search;
        const pageIndex = search.pageIndex;
        const param = JSON.stringify(search);
        const url = travelUrl + Api.hotel.hotelsList + '?param=' + param;
        return Network.get(url,
            response => {


                if (response.allOk){
                    //response.hotels[0].lowRate =  12;

                }
                else {
                    // setTimeout(()=>{
                    //     dispatch(refreshHotels());
                    // },2000);

                }
                dispatch(refreshHotelsList(response, pageIndex));
            },
            error => {

            }
        );
    }
}


export let fetchHotelsList = (isLoadMore, isRefreshing, isLoading)=> {
    return {
        type: types.FETCH_HOTELS_LIST,
        isLoadMore: isLoadMore,
        isRefreshing: isRefreshing,
        isLoading: isLoading,
    };
};

let receiveHotelsList = (data, pageIndex) => {
    //data = {count: 0, hotels: []};
    //console.log(data);
    return {
        type: types.RECEIVE_HOTELS_LIST,
        list: data,
        pageIndex,
        //isEmpty: data.count == 0
    };
};

let refreshHotelsList = (data, pageIndex)=>{
    return {
        type: types.REFRESH_HOTELS_LIST,
        list: data,
        pageIndex,
        //isEmpty: data.count == 0
    };
};


export let resetHotelsList = ()=>{
   return {
       type: types.RESET_HOTELS_LIST,
       list : {count:0,hotels:[]}
   }
};

export let showHotelsFilter = (filter, visible) => {
    return {
        type: types.SHOW_HOTELS_FILTER,
        filter,
        visible
    };
};

export let showHotelsLoading = visible => {
    return {
        type: types.SHOW_HOTELS_LIST_LOADING,
        visible
    };
};
