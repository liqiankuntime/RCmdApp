/**
 * Created by huangzhangshu on 16/9/10.
 */
'use strict'

import NativeModule from '../native/NativeModule';
import {Alert} from 'react-native';
import {travelUrl, baseUrl, Api, Network} from '../../common/utils';


// const travelUrl = 'http://10.2.128.25:8080';

//预估费用
export function postEstimate(params, onSuccess, onError) {
    console.log(params);
    return fetch(travelUrl + Api.recmd.getEstimate, {
        method: 'post',
        body: JSON.stringify(params),
    }).then((response) => {
        if (response.ok) {
            response.json().then(json => {
                if (onSuccess) {
                    onSuccess(json)
                }
            })
        } else {
            response.json().then((response) => {
                // 此处不作神州身份关联
                // var error = new Error();
                // error.response = response;
                // error.status = response.status;
                // throw error;
                if (onError)
                    onError(response.msg)
            })
        }

    }).catch(error => {
        if (onError)
            onError(error);
    })
}

//预约
export function createOrder(params, onSuccess, onError) {
    console.log(params);
    return fetch(travelUrl + Api.recmd.createOrder, {
        method: 'post',
        body: JSON.stringify(params)
    }).then((response) => {
        if (response.ok) {
            response.json().then((response) => {
                if (onSuccess) {
                    onSuccess(response)
                }
            })
        } else {
            response.json().then((response) => {
                var error = new Error();
                error.response = response;
                error.status = response.status;
                if (error)
                    onError(error)
            })
        }

    }).catch(error => {
        if (onError)
            onError(error)
    })
}

//获取订单详情
export function getOrderdetail(params, onSuccess, onError) {
    const {orderId} = params
    const param = {
        orderId: orderId,
    }
    const REQUEST_PARAM = '?param=' + JSON.stringify(param)
    return (
        fetch(travelUrl + Api.recmd.getOrderDetail + REQUEST_PARAM).then((response) => {
            if (response.ok) {
                response.json().then((response) => {
                    if (onSuccess)
                        onSuccess(response)
                })
            } else {
                var error = new Error();
                error.response = response;
                error.status = response.status;
                throw error;
            }
        }).catch(error => {
            console.log(error);
            if (onError)
                onError(error)
        })
    )
}

//取消订单
export function cancelOrder(params, onSuccess, onError) {
    var {orderId} = params;
    return (
        fetch(travelUrl + Api.recmd.cancelOrder, {
            method: 'post',
            body: JSON.stringify({
                orderId: orderId,
            })
        }).then((response) => {
            if (response.ok) {
                response.json().then((response) => {
                    if (onSuccess)
                        onSuccess(response)
                })
            } else {
                response.json().then((response) => {
                    var error = new Error()
                    if (typeof(response) === 'string') {
                        error.response = response
                    } else {
                        error.response = response.msg;
                    }
                    error.status = response.status;
                    if (onError)
                        onError(error)
                })
            }
        }).catch((error) => {
            if (onError)
                onError(error)
        })
    )
}

export function getRange(param, onSuccess, onError) {
    const REQUEST_PARAM = '?param=' + JSON.stringify(param)
    let base = baseUrl.indexOf('/') === (baseUrl.length - 1) ? baseUrl.substr(0, baseUrl.length - 1) : baseUrl;
    return Network.get(base + Api.recmd.car_getRange + REQUEST_PARAM, onSuccess, onError);
}

export function linkage(param, onSuccess, onError) {
    const REQUEST_PARAM = '?param=' + JSON.stringify(param)
    let base = baseUrl.indexOf('/') === (baseUrl.length - 1) ? baseUrl.substr(0, baseUrl.length - 1) : baseUrl;
    return Network.get(base + Api.recmd.car_linkage + REQUEST_PARAM, onSuccess, onError);
}

export function getDepartmentById(id, onSuccess, onError) {
    let ids = [];
    ids.push(id);
    let params = {
        ids
    }
    const REQUEST_PARAM = '?param=' + JSON.stringify(params);
    return Network.get(baseUrl + Api.recmd.getDepartmentById + REQUEST_PARAM, onSuccess, onError);
}

export function getProjectById(id, onSuccess, onError) {
    let ids = [];
    ids.push(id);
    let params = {
        ids
    }
    const REQUEST_PARAM = '?param=' + JSON.stringify(params);
    return Network.get(baseUrl + Api.recmd.getProjectById + REQUEST_PARAM, onSuccess, onError);
}

export function getDisburseById(id, onSuccess, onError) {
    let ids = [];
    ids.push(id);
    let params = {
        ids
    }
    const REQUEST_PARAM = '?param=' + JSON.stringify(params);
    return Network.get(baseUrl + Api.recmd.getDisburseById + REQUEST_PARAM, onSuccess, onError);
}

export function orderPayment(params, onSuccess, onError) {
    var {orderId, pubPriType} = params
    return (
        fetch(travelUrl + Api.recmd.orderPayment, {
            method: 'post',
            body: JSON.stringify({
                orderId: orderId,
                pubPriType: 'pub',
                version: 2,
            })
        }).then((response) => {
            if (response.ok) {
                response.json().then((response) => {
                    if (onSuccess)
                        onSuccess(response)
                })
            } else {
                response.json().then((response) => {
                    var error = new Error()
                    error.response = response
                    error.status = response.status;
                    if (onError)
                        onError(error)
                })
            }
        }).catch((error) => {
            if (onError)
                onError(error)
        })
    )
}

var bd2gcjUrl = 'http://api.zdoz.net/bd2gcj.aspx?'

//百度坐标系转换成gcj坐标系
export function bd2gcj(lat, lng, onSuccess, onError) {
    var param = 'lat=' + lat + '&lng=' + lng
    return (
        fetch(bd2gcjUrl + param).then((response) => {
            if (response.ok) {
                response.json().then((response) => {
                    if (onSuccess)
                        onSuccess(response)
                })
            } else {
                var error = new Error()
                error.response = response
                error.status = response.status;
                if (onError)
                    onError(error)
            }
        }).catch((error) => {
            if (onError)
                onError(error)
        })
    )
}

//获取城市档案列表
export function getCityList(params, onSuccess, onError) {
    const {type, serviceId, supplier} = params
    const param = {
        type: type,
        serviceId: serviceId,
        supplier,
    }
    const REQUEST_PARAM = '?param=' + JSON.stringify(param)
    return fetch(travelUrl + Api.recmd.getUCarCities + REQUEST_PARAM).then((response) => {
        if (response.ok) {
            response.json().then((response) => {
                if (onSuccess)
                    onSuccess(response)
            })
        } else {
            var error = new Error();
            error.response = response;
            error.status = response.status;
            throw error;
        }
    }).catch((error) => {
        console.log(error);
        if (onError)
            onError(error)
    })
}

//根据城市获取机场档案列表
export function getCityAirportList(params, onSuccess, onError) {
    const {cityId} = params
    const param = {
        cityId: cityId,
    }
    const REQUEST_PARAM = '?param=' + JSON.stringify(param)
    fetch(travelUrl + Api.recmd.getCityAirportList + REQUEST_PARAM).then((response) => {
        if (response.ok) {
            response.json().then((response) => {
                if (onSuccess)
                    onSuccess(response)
            })
        } else {
            var error = new Error();
            error.response = response;
            error.status = response.status;
            throw error;
        }
    }).catch((error) => {
        console.log(JSON.stringify(error));
        if (onError)
            onError(error)
    })

}

//获取司机数量及等待时间
export function getNearbycars(params, onSuccess, onError) {
    const {slat, slng} = params
    const param = {
        slat: slat,
        slng: slng,
    }
    const REQUEST_PARAM = '?param=' + JSON.stringify(param)
    fetch(travelUrl + Api.recmd.getnearbycars + REQUEST_PARAM).then((response) => {
        if (response.ok) {
            response.json().then((response) => {
                if (onSuccess)
                    onSuccess(response)
            })
        } else {
            var error = new Error();
            error.response = response;
            error.status = response.status;
            throw error;
        }
    }).catch((error) => {
        console.log(JSON.stringify(error));
        if (onError)
            onError(error)
    })

}

//校验建研院字段
export function getAddtionalRule(params, onSuccess, onError) {
    const REQUEST_PARAM = '?param=' + JSON.stringify(params)
    fetch(baseUrl + Api.recmd.getaddtioalrule1 + REQUEST_PARAM).then((response) => {
        if (response.ok) {
            response.json().then((response) => {
                if (onSuccess)
                    onSuccess(response)
            })
        } else {
            var error = new Error();
            error.response = response;
            error.status = response.status;
            throw error;
        }
    }).catch((error) => {
        console.log(JSON.stringify(error));
        if (onError)
            onError(error)
    })

}


export function doGetRequest(url, params, onSuccess, onError) {
    let REQUEST_PARAM = ''
    if (params)
        REQUEST_PARAM = '?param=' + JSON.stringify(params)
    fetch(url + REQUEST_PARAM).then((response) => {
        if (response.ok) {
            response.json().then((response) => {
                if (onSuccess)
                    onSuccess(response)
            })
        } else {
            var error = new Error();
            error.response = response;
            error.status = response.status;
            throw error;
        }
    }).catch((error) => {
        console.log(error);
        if (onError)
            onError(error)
    })
}

export function doPostRequest(url, params, onSuccess, onError) {
    fetch(url, {
        method: 'post',
        body: JSON.stringify(params),
    }).then((response) => {
        if (response.ok) {
            response.json().then((response) => {
                if (onSuccess)
                    onSuccess(response)
            })
        } else {
            var error = new Error();
            error.response = response;
            error.status = response.status;
            throw error;
        }
    }).catch((error) => {
        console.log(error);
        if (onError)
            onError(error)
    })
}




