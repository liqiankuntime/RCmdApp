/**
 * Created by chenty on 2016/10/18.
 * @flow
 */

import { Dimensions } from 'react-native';
import * as NATIVE from '../../native';

let baseUrl = 'http://test.wecaiwu.com/';
let rootUrl = 'http://testtrade.wecaiwu.com/travel/';

if (NATIVE.getBaseUrl) {
    NATIVE.getBaseUrl((base, travel) => {
        baseUrl = base
        rootUrl = travel
    });
}

let api = {
    hotelsList: rootUrl + 'elhotel/list/',
    hotelDetail: rootUrl + 'elhotel/detail/',
    brands: rootUrl + 'elbrand/list/',
    order: rootUrl + 'hotel/myorder/detail/',
    createOrder: rootUrl + 'hotel/myorder/create/',
    cancelOrder: rootUrl + 'hotel/myorder/cancel/',
};

let window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
};

let colors = {
    themeColor: 'rgb(217, 51, 58)',
    lightGray: '#f3f3f3',
    lightOrange: '#faad94',
    orange: 'rgb(237,113,64)',
    backNavi: '#ed7140',
    backBody: '#f3f3f3',
    line: '#e5e5e5',
    textLight: '#999999',
    text: '#333333',
};

let storeKeys = {
    SEARCH_HISTORY_KEY: 'SEARCH_HISTORY_KEY',
};
let starRates = ['不限', '经济', '经济', '三星', '四星', '五星'];
let version = 310;

export default {
    api:api,
    window: window,
    colors: colors,
    storeKeys: storeKeys,
    starRates:starRates,
    version:version
}