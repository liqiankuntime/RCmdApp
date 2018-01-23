/**
 * Created by haosha on 2016/10/27.
 */

import {Alert, InteractionManager} from 'react-native';
import {getBaseUrl, baiduLogEvent} from '../native';

export var baseUrl = __DEV__ ? 'http://test.wecaiwu.com/' : undefined;
export var travelUrl = __DEV__ ? 'http://testtrade.wecaiwu.com/' : 'https://trade.wecaiwu.com/';

export function setBaseUrl(base, travel) {
    if (base && base.length)
        baseUrl = base;
    if (travel && travel.length)
        travelUrl = travel;
}

if (getBaseUrl) {
    getBaseUrl((base, travel) => {
        setBaseUrl(base, travel);
    });
}

export const Api = {
    recmd: {
        intelligent: '/travel/recommend/intelligent/',
        changeTicket: '/travel/recommend/changeticket/',
        getEstimate: '/travel/taxi/getestimate/',
        createOrder: '/travel/taxi/createorder/',
        getOrderDetail: '/travel/taxi/getorderdetail/',
        cancelOrder: '/travel/taxi/cancelorder/',
        orderPayment: '/travel/taxi/orderPayment/',
        getUCarCities: '/travel/taxi/getucarcitys/',
        getCityAirportList: '/travel/taxi/getcityairportlist/',
        getnearbycars: '/travel/taxi/getnearbycars/',
        getaddtioalrule1: 'expense/addtionalrule1/',
        car_getRange: '/expense/carconventiongetrange/',
        car_linkage: '/expense/carconventionlinkage/',
        getDepartmentById: '/organization/refreshdepartments/',
        getProjectById: '/organization/refreshexpenseitems/',
        getDisburseById: '/organization/alldisburse/',
        suppliers: '/travel/taxi/getavailablesuppliers/',
    },
    hotel: {
        hotelsList: 'travel/elhotel/list/',
        hotelDetail: 'travel/elhotel/detail/',
        brands: 'travel/elbrand/list/',
        order: 'travel/hotel/myorder/detail/',
        createOrder: 'travel/hotel/myorder/create/',
        cancelOrder: 'travel/hotel/myorder/cancel/',
        getContacts: 'organization/contacts/',
        hotelrefreshtimes: 'travel/apphotelrefreshtimes/',
        hotelDetailRefreshtimes: 'travel/apphoteldetailrefreshtimes/',
    },
    orderform: {
        jdList: 'thirdpartdata/getjdjsconternt/',
        jdListForIos: 'thirdpartdata/getjdjsconterntforios/',
        jdFilterList: 'expense/canbesweep/',
    },
    expressage: {
        orderList: 'travel/express/orderlist/',
        preview: 'travel/express/previewprinttemplate/',
        sendEmail: 'travel/express/sendprinttemplate/',
        agreement: 'travel/express/agreement/',
        staffaddress: '/travel/express/staffaddress/',
        getOrderDetail: 'travel/express/order/',
        staffaddresslist: '/travel/express/staffaddresslist/',
        qureyfee: '/travel/express/qureyfee/',
        qureyarrivetime: '/travel/express/qureyarrivetime/',
        order: '/travel/express/order/',
        companyaddress: '/travel/express/companyaddress/',
    }

};

export const Network = {
    get: (url, successCallback, failCallback) => {
        console.log(url);
        return fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'text/html, application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    console.log(JSON.stringify(response));
                    var error = new Error();
                    error.response = response;
                    error.status = response.status;
                    throw error;
                }
            })
            .then(json => {
                if (successCallback)
                    successCallback(json);
            })
            .catch(error => {
                console.log(error);
                if (failCallback)
                    failCallback(error);
            });
    },
    post: (url, body, successCallback, failCallback) => {
        console.log(url);
        const jsonText = JSON.stringify(body);
        console.log(jsonText);
        return fetch(url, {
            method: 'POST',
            body: jsonText,
            headers: {
                'Accept': 'text/html, application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    console.log(JSON.stringify(response));
                    var error = new Error();
                    error.response = response;
                    error.status = response.status;
                    throw error;
                }
            })
            .then(json => {
                if (successCallback)
                    successCallback(json);
            })
            .catch(error => {
                console.log(error);
                if (failCallback)
                    failCallback(error);
            });
    },
    delete: (url, successCallback, failCallback) => {
        console.log(url);
        return fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'text/html, application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    var error = new Error();
                    error.response = response;
                    error.status = response.status;
                    throw error;
                }
            })
            .then(json => {
                if (successCallback)
                    successCallback(json);
            })
            .catch(error => {
                console.log(error);
                if (failCallback)
                    failCallback(error);
            });
    },
    put: (url, body, successCallback, failCallback) => {
        console.log(url);
        const jsonText = JSON.stringify(body);
        console.log(jsonText);
        return fetch(url, {
            method: 'PUT',
            body: jsonText,
            headers: {
                'Accept': 'text/html, application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    console.log(JSON.stringify(response));
                    var error = new Error();
                    error.response = response;
                    error.status = response.status;
                    throw error;
                }
            })
            .then(json => {
                if (successCallback)
                    successCallback(json);
            })
            .catch(error => {
                console.log(error);
                if (failCallback)
                    failCallback(error);
            });
    },
};

function message(title, msg) {
    InteractionManager.runAfterInteractions(() =>
        setTimeout(
            () => Alert.alert(title, msg),
            100
        )
    );
}

function errorMsg(title, msg, error) {
    if (error && error.status && error.response) {
        switch (error.status) {
            case 400:
                error.response.json().then(json => {
                    const content = __DEV__
                        ? ('[' + json.errorCode + ']:' + json.msg)
                        : ('[' + json.errorCode + ']:' + (json.errorCode == 5000 ? msg : json.msg));
                    message(title, content);
                });
                break;
            default:
                error.response.text().then(text => {
                    const content = '[' + error.status + ']:' + (__DEV__ ? text : msg);
                    message(title, content);
                });
                break;
        }
    }
    else {
        const errMsg = error ? msg + '\n' + error.toString() : msg;
        const content = '[local]:' + (__DEV__ ? errMsg : msg);
        message(title, content);
    }
}

export const MessageBox = {
    show: (title, msg) => {
        message(title, msg);
    },
    error: (title, msg, error) => {
        errorMsg(title, msg, error);
    },
    debug: (msg, error) => {
        if (__DEV__) {
            errorMsg('DEBUG', msg, error);
        }
    },
};

export function track(event, type) {
    if (baiduLogEvent) {
        baiduLogEvent(event, type);
    }
}
