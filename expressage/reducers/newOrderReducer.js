/**
 * Created by huangzhangshu on 17/4/21.
 */
import * as types from '../actions/actionTypes';
import {constant, initialConstant} from '../main/ExpressConstant';

const initialState = {
    data: constant,
    productVisible: false,
    valueAddsVisible: false,
    paymentVisible: false,
    addressVisible: false,
    addressData: [],
    type: 'from',
    prices: 0,
    loading: false,
};

function updateDataSource(source, item) {
    for (let i = 0; i < source.length; i++) {
        if (source[i].code === item.code) {
            source[i] = {...item};
            break;
        }
    }
    return source;
};

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

export default function newOrderReducer(state = initialState, action = {}) {
    switch (action.type) {
        case types.UPDATE_NEW_ORDER_ITEM: {
            const {item} = action;
            var source = updateDataSource(state.data, item);
            return {...state, data: source.slice(0)};
        }
        case types.UPDATE_EXPRESS_MODEL_VISIBLE: {
            const {code} = action;
            if (code === 'product') {
                state.productVisible = !state.productVisible;
            } else if (code === 'value_added_services') {
                state.valueAddsVisible = !state.valueAddsVisible;
            } else if (code === 'payment') {
                state.paymentVisible = !state.paymentVisible;
            } else if (code === 'send' || code === 'put') {
                state.addressVisible = !state.addressVisible;
            }
            return {...state};
        }
        case types.UPDATE_ADDRESS_DATA: {
            return {...state, addressData: action.data.slice(0), type: action.action_type};
        }
        case types.QUERY_EXPRESS_PRICES: {
            return {...state, prices: action.response};
        }
        case types.OPTION_ADDRESS_DATA: {
            const {data, option} = action;
            var {addressData} = state;
            if (option === 'add') {
                addressData.push(data);
            } else if (option === 'remove') {
                for (let i = 0; i < addressData.length; i++) {
                    if (addressData[i].id === data.id) {
                        addressData.splice(i, 1);
                        break;
                    }
                }
            } else if (option === 'edit') {
                for (let i = 0; i < addressData.length; i++) {
                    if (addressData[i].id === data.id) {
                        addressData[i] = {...data};
                        break;
                    }
                }
            }
            return {...state, addressData: addressData.slice(0)};
        }
        case types.QUERY_ARRIVE_TIME : {
            const {data} = state;
            let item = getItemFromDataSource(data, 'arrivetime');
            var splits = action.response.split(',');
            if (splits && splits.length === 2) {
                item.value = '约' + splits[0] + ' - ' + '约' + splits[1];
                item.result = action.response;
            }
            var source = updateDataSource(state.data, item);
            return {...state, data: source.slice(0)};
        }
        case types.UPDATE_LOADING_VISIBLE: {
            return {...state, loading: action.visible};
        }
        case types.CLOSE_MODAL_VISIBLE: {
            return {
                ...state,
                productVisible: false,
                valueAddsVisible: false,
                paymentVisible: false,
                addressVisible: false
            };
        }
        case types.CLEAR_EXPRESS_STATE: {
            return {
                data: [
                    {
                        name: '寄件地址',
                        placeholder: '寄件地址',
                        type: 'address',
                        code: 'send',
                        emptyLine: false,
                    },
                    {
                        name: '收件地址',
                        placeholder: '收件地址',
                        type: 'address',
                        code: 'put',
                        emptyLine: true,
                    },
                    {
                        name: '上门时间',
                        placeholder: '快递统一收件',
                        emptyLine: true,
                        showArrow: true,
                        code: 'time',
                        default: true,
                    },
                    {
                        name: '物品名称',
                        type: 'textinput',
                        placeholder: '请填写名称',
                        emptyLine: false,
                        showArrow: false,
                        code: 'name',
                    },
                    {
                        name: '产品类型',
                        value: '顺丰次日',
                        result: '顺丰次日',
                        emptyLine: true,
                        showArrow: true,
                        code: 'product',
                    },
                    {
                        name: '运输时效',
                        placeholder: '',
                        emptyLine: false,
                        showArrow: false,
                        code: 'arrivetime',
                    },
                    {
                        name: '增值服务',
                        value: '未保价',
                        emptyLine: true,
                        showArrow: true,
                        code: 'value_added_services',
                    },
                    {
                        name: '付款方式',
                        value: '寄方付',
                        result: '寄方付',
                        emptyLine: true,
                        showArrow: true,
                        code: 'payment',
                    },

                ],
                productVisible: false,
                valueAddsVisible: false,
                paymentVisible: false,
                addressVisible: false,
                addressData: [],
                type: 'from',
                prices: 0,
                loading: false,
            };
        }
    }
    return state;
};