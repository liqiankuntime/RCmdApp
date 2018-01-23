/**
 * Created by chenty on 2016/10/18.
 */
import * as types from '../actions/actionTypes';

const initialState = {
    filter: {
        brandFilter: {
            visible: false,
        },
        distanceFilter: {
            visible: false,
        },
        starPriceFilter: {
            visible: false,
        },
        priceSortFilter: {
            visible: false,
        }
    },
    list: {
        count: 0,
        data: []
    },

    isLoading: true,
    isLoadMore: false,
    isRefreshing: false
};

let hotelsListReducer = (state = initialState, action = {}) => {
    let data = [];
    let list = {};
    switch (action.type) {
        case types.FETCH_HOTELS_LIST:
            return Object.assign({}, state, {
                isLoading: action.isLoading,
                isLoadMore: action.isLoadMore,
                isRefreshing: action.isRefreshing,
            });
        case types.RECEIVE_HOTELS_LIST:
            data = action.pageIndex == 1 ? action.list.hotels : [...state.list.data, ...action.list.hotels];
            list = {...state.list, data, allOk: action.list.allOk, count: action.list.count};
            return {...state, list, isLoadMore: false, isLoading: false, isRefreshing: false};

        case types.REFRESH_HOTELS_LIST:
            data = [...state.list.data];

            for (let hotel of action.list.hotels) {
                for (let old_hotel of data) {
                    if (old_hotel.hotelId == hotel.hotelId) {
                        old_hotel.lowRate = hotel.lowRate;
                    }
                }
            }
            list = {...state.list, data, allOk: action.list.allOk, count: action.list.count};
            return {...state, list, isLoadMore: false, isLoading: false, isRefreshing: false};

        case types.SHOW_HOTELS_FILTER:
            const flt = {};
            flt[action.filter] = {visible: action.visible};
            const filter = {...initialState.filter, ...flt};
            return {...state, filter};
        case types.SHOW_HOTELS_LIST_LOADING:
            return {...state};
        case types.RESET_HOTELS_LIST:
            let emptyList = {count: 0, hotels: []};
            return {...state, emptyList, isLoadMore: false, isLoading: true, isRefreshing: false}
        default:
            return state;
    }
};

export default hotelsListReducer;