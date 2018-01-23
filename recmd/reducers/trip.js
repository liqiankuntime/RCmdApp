/**
 * Created by haosha on 16/9/1.
 */

import * as Actions from '../actions/types';
import taxi from './taxi';
import traffic from './traffic';
import hotel from './hotel';
import {
    sortTripsByDate,
    ITEM_TAXI_TO,
    ITEM_TAXI_FROM,
    ITEM_TRAFFIC,
    ITEM_HOTEL
} from '../common/comm';

function add_trip(state, action) {
    const ids = state.map(trip => trip.id);
    const tripId = ids.reduce((t1, t2) => t1 + t2, 1);
    action.trip.id = tripId;
    const trips = [...state, action.trip];
    const newState = sortTripsByDate(trips);
    return newState.filter(trip => trip.items.length);
}

function update_trip(state, action) {
    const newState = state.map(trip => {
        if (trip.id == action.trip.id) {
            const newTrip = action.trip;
            return {...trip, ...newTrip};
        }
        return trip;
    });
    return newState.filter(trip => trip.items.length);
}

function delete_item(state, action) {
    const newState =  state.map(trip => {
        if (trip.id == action.tripId) {
            const items = trip.items.filter(item => {
                return item.id != action.id;
            });
            return {...trip, items};
        }
        return trip;
    });
    return newState.filter(trip => trip.items.length);
}

function update_item(state, action) {
    const newState = state.map(trip => {
        if (trip.id == action.tripId) {
            const items = trip.items.map(item => {
                const newItem = action.item;
                if (item.id == action.id)
                    return {...item, ...newItem};
                return item;
            });
            return {...trip, items};
        }
        return trip;
    });
    return newState.filter(trip => trip.items.length);
}

export default function tripReducer(state = [], action = {}) {
    switch (action.type) {
        case Actions.LOAD_ALL:
            return sortTripsByDate(action.trips);
        case Actions.ADD_TRIP:
            return add_trip(state, action);
        case Actions.UPD_TRIP:
            return update_trip(state, action);
        case Actions.UPD_ITEM:
            return update_item(state, action);
        case Actions.DEL_ITEM:
            return delete_item(state, action);
        default:
            break;
    }

    const newState = state.map(trip => {
        const items = trip.items.map(item => {
            if (action.type == Actions.DEL_ITEM && item.id == action.id) {
                return {};
            }
            switch (item.type) {
                case ITEM_TAXI_TO:
                case ITEM_TAXI_FROM:
                    return taxi(item, action);
                case ITEM_TRAFFIC:
                    return traffic(item, action);
                case ITEM_HOTEL:
                    return hotel(item, action);
                default:
                    return item;
            }
        });
        return {...trip, items: items.filter(item => !!item.id)};
    });
    return newState.filter(trip => trip.items.length);
}