/**
 * Created by haosha on 16/10/20.
 */

import * as types from '../actions/actionTypes';

const initialState = [
    {
        "groupName": "经济",
        "group": 2,
        "id": 1,
        "name": "如家"
    },
    {
        "groupName": "经济",
        "group": 2,
        "id": 2,
        "name": "七天"
    },
    {
        "groupName": "舒适",
        "group": 3,
        "id": 3,
        "name": "裕龙酒店"
    },
    {
        "groupName": "高档",
        "group": 4,
        "id": 4,
        "name": "假日大酒店"
    },
    {
        "groupName": "豪华",
        "group": 5,
        "id": 5,
        "name": "香格里拉大酒店"
    }
];

export default function brandReducer(state = initialState, action = {}) {
    switch (action.type) {
        case types.GET_HOTEL_BRANDS:
            console.log('GET_HOTEL_BRANDS')
            return action.brands;
        default :
            console.log('default<><><>')
            return state;
    }
}