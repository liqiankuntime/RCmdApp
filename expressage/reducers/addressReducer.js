/**
 * Created by huangzhangshu on 17/4/21.
 */
import * as types from '../actions/actionTypes';
import {address} from '../main/ExpressConstant';

const initialState = {
    data: address,
    companyAddress: {},
    streetSheetVisible: false,
    streetVisible: false,
    streetData: [],
};

function updateDataSource(source, item) {
    for (let i = 0; i < source.length; i++) {
        if (source[i].code === item.code) {
            source[i] = {...item};
            break;
        }
    }
    return source;
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

export default function (state = initialState, action = {}) {
    switch (action.type) {
        case types.UPDATE_ADDRESS_ITEM: {
            let source = updateDataSource(state.data, action.item);
            return {...state, data: source.slice(0)};
        }
        case types.UPDATE_ADDRESS_TITLE: {
            const {_type} = action;
            const {data} = state;
            const userName = getItemFromDataSource(data, 'userName');
            const province = getItemFromDataSource(data, 'province');
            const street = getItemFromDataSource(data, 'street');
            if (_type === 'from') {
                userName.name = '寄件人';
                province.disabled = true;
                street.disabled = true;
                province.showArrow = false;
                street.showArrow = false;
            } else {
                userName.name = '收件人';
                province.disabled = false;
                street.disabled = false;
                province.showArrow = true;
                street.showArrow = true;
            }
            let source = updateDataSource(state.data, userName);
            source = updateDataSource(state.data, province);
            source = updateDataSource(state.data, street);
            return {...state, data: source.slice(0)};
        }
        case types.UPDATE_ADDRESS_FOR_PROPS: {
            const {address} = action;
            const {data} = state;
            let source;
            for (let item of data) {
                if (item.code === 'province') {
                    item.value = address.province + ' ' + address.city + ' ' + address.area;
                    item.result = {
                        province: address.province,
                        city: address.city,
                        area: address.area,
                    };
                } else {
                    item.value = address[item.code];
                    item.result = address[item.code];
                }
                source = updateDataSource(data, item);
            }
            return {...state, data: source.slice(0)};
        }
        case types.COMPANY_ADDRESS: {
            return {...state, companyAddress: action.response};
        }
        case types.UPDATE_ADDRESS_STREET_VISIBLE: {
            if (action.code === 'sheet') {
                return {...state, streetSheetVisible: !state.streetSheetVisible};
            } else {
                const {visible} = action;
                return {...state, streetVisible: visible};
            }
        }
        case types.UPDATE_STREET_DATA: {
            return {...state, streetData: action.streetData.slice(0)};
        }
        case types.CLEAR_ADDRESS_STATE: {
            return {
                companyAddress: {}, data: [
                    {
                        name: '公司名称',
                        type: 'textinput',
                        placeholder: '个人或公司名称',
                        emptyLine: false,
                        showArrow: false,
                        code: 'company',
                    },
                    {
                        name: '寄件人',
                        type: 'textinput',
                        placeholder: '请输入姓名',
                        emptyLine: false,
                        showArrow: false,
                        code: 'userName',
                    },
                    {
                        name: '联系电话',
                        type: 'textinput',
                        keyboardType: 'numeric',
                        maxLength: 13,
                        placeholder: '手机号或带区号的固话',
                        emptyLine: false,
                        showArrow: false,
                        code: 'mobile',
                    },
                    {
                        name: '省市区',
                        placeholder: '请选择所在的省市区',
                        emptyLine: false,
                        showArrow: false,
                        code: 'province',
                    },
                    {
                        name: '街道',
                        placeholder: '请选择街道',
                        emptyLine: false,
                        showArrow: false,
                        code: 'street',
                    },
                    {
                        name: '详细地址',
                        type: 'textinput',
                        placeholder: '请输入详细的地址门牌',
                        emptyLine: false,
                        showArrow: false,
                        code: 'address',
                    },
                ]
            }
        }
    }

    return state;
}