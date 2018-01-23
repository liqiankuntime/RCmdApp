/**
 * Created by huangzhangshu on 17/4/21.
 */

import * as types from './actionTypes';
import {travelUrl, Network, Api} from '../../common/utils';
import {alertShow} from '../../common/Alert';
import Order from '../Order';

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export function updateDataSource(item, data) {
    if (item.code === 'time') {
        if (data.isNow) {
            data.result = new Date().Format('yyyy-MM-dd hh:mm');
            item.value = data.dateShow;
            item.default = true;
        } else {
            item.result = data.time;
            item.value = data.dateShow + ' ' + data.timeShow;
            item.default = false;
        }
    } else if (item.code === 'value_added_services') {
        if(data === ''){
            item.value = '未保价';
            item.result = null;
        }else{
            item.value = '保价 ' + data + '元';
            item.result = data;
        }
    } else if (item.code === 'arrivetime') {
        var splits = data.split(',');
        if (splits && splits.length === 2) {
            item.value = splits[0] + ' 至 ' + splits[1];
            item.result = data;
        }
    } else {
        item.result = data;
        item.value = data;
    }
    return {
        type: types.UPDATE_NEW_ORDER_ITEM,
        item,
    }
};

export function updateVisible(code) {
    return {
        type: types.UPDATE_EXPRESS_MODEL_VISIBLE,
        code,
    }
};

export function updateAddressData(data, type) {
    return {
        type: types.UPDATE_ADDRESS_DATA,
        data,
        action_type: type,
    }
}

export function optionAddressData(data, option) {
    return {
        type: types.OPTION_ADDRESS_DATA,
        data,
        option,
    }
}

export function fetchFuturePrices(param) {
    return (dispatch, getState) => {
        return Network.get(travelUrl + Api.expressage.qureyfee + '?param=' + JSON.stringify(param), (response) => {
            dispatch({
                type: types.QUERY_EXPRESS_PRICES,
                response: response,
            })
        })
    }
}

export function fetchArriveTime(param) {
    return (dispatch, getState) => {
        return Network.get(travelUrl + Api.expressage.qureyarrivetime + '?param=' + JSON.stringify(param), (response) => {
            console.log('获取抵达时间＝===>' + JSON.stringify(response));
            dispatch({
                type: types.QUERY_ARRIVE_TIME,
                response: response,
            })
        })
    }
}

export function fetchCreateOrder(param, navigator) {
    return (dispatch, getState) => {
        dispatch(updateLoadingVisible(true));
        return Network.post(travelUrl + Api.expressage.order, param, (response) => {
            dispatch(updateLoadingVisible(false));
            dispatch({
                type: types.CREATE_NEW_ORDER,
                response: response,
            })
            alertShow('订单生成成功', function () {
                navigator.replace({
                    name: 'Order',
                    component: Order,
                    passProps: {
                        orderNo: response.orderNo,
                    }
                })
            });
        }, (error) => {
            if(error.status === 400){
                error.response.json().then((json) => {
                    console.log('json:' + JSON.stringify(json));
                    alertShow('订单生成失败:' + JSON.stringify(json.msg));
                })
            }else{
                alertShow('订单生成失败');
            }
            dispatch(updateLoadingVisible(false));
        })
    }
};

export function fetchDeleteAddress(data) {
    return (dispatch, getState) => {
        let param = {
            id: data.id,
        }
        return Network.delete(travelUrl + Api.expressage.staffaddress + '?param=' + JSON.stringify(param), (response) => {
            const option = 'remove';
            dispatch({
                type: types.OPTION_ADDRESS_DATA,
                data,
                option,
            });
        }, (error) => {
            alertShow('删除失败');
            console.log('删除失败:' + error);
        })
    }
};

export function updateLoadingVisible(visible) {
    return {
        type: types.UPDATE_LOADING_VISIBLE,
        visible,
    }
};

export function cloneModals() {
    return {
        type: types.CLOSE_MODAL_VISIBLE,
    }
};

export function clearStatus() {
    return {
        type: types.CLEAR_EXPRESS_STATE,
    }
}