/**
 * Created by haosha on 16/10/20.
 */

import * as types from '../actions/actionTypes';
import moment from 'moment';

const initialState = {
    cityId: 95,
    cityName: '北京',             // 城市名称
    startDate: moment().add(0,'d').format('YYYY-MM-DD'),     // 入住日期
    endDate: moment().add(1,'d').format('YYYY-MM-DD'),       // 离开日期
    starRate: [0],           // 酒店星级
    lowRate: 0,                // 最低价格
    highRate: 9999,
    radius: 10000,                  // 搜索半径,距离范围
    brand: [],              // 品牌
    lat: 0,                    // 纬度
    lng: 0,

    location:'',             // 目的地名称
    // Default艺龙默认排序 | StarRankDesc推荐星级降序 | RateAsc价格升序 | RateDesc价格降序 | DistanceAsc距离升序
    sort:'DistanceAsc',
    pageIndex: 0,                // 分页索引
    pageSize: 15,
    pubpritype: '',
    keywords: '',
    version:0,
};

function update_search_cond(state, action) {
    const search = action.search;
    return {...state, ...search};
}

function reset_page_index(state, action) {
    return {...state, pageIndex: action.index};
}

export default function searchReducer(state = initialState, action = {}) {
    switch (action.type) {
        case types.UPDATE_SEARCH_CONDITION:
            return update_search_cond(state, action);
        case types.RESET_PAGE_INDEX:
            return reset_page_index(state, action);
        default:
            return state;
    }
}