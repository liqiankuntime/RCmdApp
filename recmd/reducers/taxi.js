/**
 * Created by haosha on 16/9/1.
 */

import * as Actions from '../actions/types';
import {mergeFromAndTo} from '../common/comm';

function update_taxi(state, action) {
    if (action.id == state.id) {
        let taxi = action.taxi;
        taxi = mergeFromAndTo(state, taxi);
        taxi.enabled = taxi.orderId > 0 ? false : taxi.enabled;
        return taxi;
    }
    return state;
}

function calc_taxi_price(state, action) {
    if (action.id == state.id) {
        let {pickUpResult} = state;
        const cars = action.carGroups.filter(car => car.carGroupId == pickUpResult.carGroupId);
        if (cars && cars.length) {
            const price = cars[0].price;
            pickUpResult = {...pickUpResult, price, carGroups:action.carGroups};
            return {
                ...state,
                pickUpResult
            };
        }
    }
    return state;
}

export default (state = {}, action = {}) => {
    switch (action.type) {
        case Actions.UPD_TAXI:
            return update_taxi(state, action);
        case Actions.EVL_TAXI_PRICE:
            return calc_taxi_price(state, action);
        default:
            return state;
    }
    return state;
}