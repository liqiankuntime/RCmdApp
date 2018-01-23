/**
 * Created by haosha on 16/9/1.
 */

import * as Actions from '../actions/types';
import {
    addTrip,
    updateTrip,
    deleteItem,
    updateItem,
    recommendTripsByTraffic
} from '../actions';
import {
    selectItem,
    selectTrip,
    selectTripByDate
} from '../common/comm';
import {
    ITEM_TAXI_TO,
    ITEM_TAXI_FROM,
    ITEM_TRAFFIC
} from '../common/comm';

export const onDeleteAction = store => next => action => {
    if (Actions.DEL_ITEM == action.type) {
        const state = store.getState();
        const item = selectItem(state, action.tripId, action.id);
        if (item && ITEM_TRAFFIC == item.type) {
            const trip = selectTrip(state, action.tripId);
            const all = trip ? trip.items.filter(i => item.id == i.refId) : [];
            all.forEach(i => store.dispatch(deleteItem(trip.id, i.id)));
        }
    }
    // dispatch to the next middlewares
    return next(action);
};

export const onSubmitAction = store => next => action => {
    switch (action.type) {
        case Actions.SUBMIT_TRAFFIC:
        case Actions.SUBMIT_HOTEL:
            const state = store.getState();
            const trip = state.trips.find(trip => trip.id == action.tripId);
            if (trip) {
                const items = trip.items.filter(item => item.refId == action.id);
                items.forEach(item => {
                    // don't change state forever, though it's in middleware
                    store.dispatch(updateItem(trip.id, item.id, {enabled: true, canSubmit: true}));
                });
            }
            break;
        default:
            break;
    }
    // dispatch to the next middleware
    return next(action);
};

export const onUpdateAction = store => next => action => {
    switch (action.type) {
        case Actions.UPD_TRAFFIC_ITEM:
            const result = next(action);
            const state = store.getState();
            const current = selectTrip(state, action.tripId);
            if (current) {
                const trip = selectTripByDate(state, action.item.departDate);
                const trips =  (trip && (trip.id != current.id)) ? [current, trip] : [current];
                console.log(trips);
                store.dispatch(
                    recommendTripsByTraffic(action.tripId, action.id, trips)
                );
            }
            return result;
        default:
            // dispatch to the next middleware
            return next(action);
    }
};

export const onRecommendAction = store => next => action => {
    if (Actions.RCMD_TRIP == action.type) {
        action.trips.forEach(trip =>{
            if (trip.id) {
                store.dispatch(updateTrip(trip));
            }
            else {
                store.dispatch(addTrip(trip));
            }
        });
    }
    // dispatch to the next middlewares
    return next(action);
};