/**
 * Created by haosha on 16/10/17.
 */

import * as SearchActions from './searchActions';
import * as HotelsListActions from './hotelsListActions';
import * as BrandActions from './brandActions';
import * as DetailActions from './hotelDetailActions';
import * as OrderActions from './orderActions';
import * as ConfigActions from './configActions';
import * as types from './actionTypes';

function define_initial_comp(initial) {
    return {
        type: types.DEFINE_INITIAL_COMP,
        comp: initial
    };
}

module.exports = {
    define_initial_comp,
    ...SearchActions,
    ...HotelsListActions,
    ...BrandActions,
    ...DetailActions,
    ...OrderActions,
    ...ConfigActions,
}

