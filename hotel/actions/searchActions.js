/**
 * Created by haosha on 16/10/19.
 */

import * as types from './actionTypes';

export function update_search_condition(search) {
    return {
        type: types.UPDATE_SEARCH_CONDITION,
        search
    };
}

export function resetPageIndex(index = 0) {
    return {
        type: types.RESET_PAGE_INDEX,
        index
    };
};