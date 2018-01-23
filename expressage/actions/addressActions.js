/**
 * Created by huangzhangshu on 17/4/21.
 */

import * as types from './actionTypes';
import {travelUrl, Network, Api} from '../../common/utils';

export function updateDataSourceForItem(item, data) {
    if (item.code === 'province') {
        item.value = data.province + ' ' + data.city + ' ' + data.area;
        item.result = data;

    } else if (item.code === 'street') {
        item.value = data.street;
        item.result = data.street;
    } else {
        item.value = data;
        item.result = data;
    }
    return {
        type: types.UPDATE_ADDRESS_ITEM,
        item,
    }
};

export function updateTitleForType(_type) {
    return {
        type: types.UPDATE_ADDRESS_TITLE,
        _type
    }
};

export function fetchCompanyAddress() {
    return (dispatch, getState) => {
        return Network.get(travelUrl + Api.expressage.companyaddress, (response) => {
            const state = getState();
            const {data} = state.address;
            const province = getItemFromDataSource(data, 'province');
            const street = getItemFromDataSource(data, 'street');
            const company = getItemFromDataSource(data, 'company');
            const address = getItemFromDataSource(data, 'address');
            dispatch(updateDataSourceForItem(province, response));
            dispatch(updateDataSourceForItem(street, response));
            dispatch(updateDataSourceForItem(company, response.company));
            dispatch(updateDataSourceForItem(address, response.addressHead));
            dispatch({
                type: types.COMPANY_ADDRESS,
                response,
            })
        }, (error) => {
            console.log('请求公司配置失败:' + error);
        })
    };
};

export function updateForProps(address) {
    return {
        type: types.UPDATE_ADDRESS_FOR_PROPS,
        address,
    }
}

function getItemFromDataSource(source, code) {
    let result;
    for (let item of source) {
        if (item.code === code) {
            result = item;
            break;
        }
    }
    return result;
};

export function clearAddressState() {
    return {
        type: types.CLEAR_ADDRESS_STATE,
    }
};

export function updateStreetVisible(code, visible) {
    return {
        type: types.UPDATE_ADDRESS_STREET_VISIBLE,
        code,
        visible,
    }
};

export function updateStreetData(streetData) {
    return {
        type: types.UPDATE_STREET_DATA,
        streetData,
    }
}

