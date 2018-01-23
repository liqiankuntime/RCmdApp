/**
 * Created by lc on 17/03/10.
 */

import * as types from './actionTypes';

import * as JdListActions from './jdListActions';

function define_initial_comp(initial) {
    return {
        type: types.DEFINE_INITIAL_COMP,
        comp: initial
    };
}

module.exports = {
    define_initial_comp,
    ...JdListActions,
}

