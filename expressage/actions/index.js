/**
 * Created by shane on 17/4/12.
 */
import * as types from './actionTypes';
import * as orderListActions from './orderListActions';
import * as newOrderActions from './newOrderActions';
import * as addressActions from './addressActions';

function define_initial_comp(initial) {
    return {
        type: types.DEFINE_INITIAL_COMP,
        comp: initial
    };
}

module.exports = {
    define_initial_comp,
    ...orderListActions,
    ...newOrderActions,
    ...addressActions,
};