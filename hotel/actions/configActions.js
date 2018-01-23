/**
 * Created by haosha on 16/10/20.
 */

import * as types from './actionTypes';
import {travelUrl, Api, Network} from '../../common/utils';
import Constants from '../common/constants';


export function fetchConfig() {
    return (dispatch, getState) => {

        const url = travelUrl + Api.hotel.hotelrefreshtimes;
        return Network.get(url,
            response => {
                //dispatch(showHotelsLoading(false));
                let args = response.split('|');
                let data = {limit: 6, seconds: 2};
                if (args.length == 2) {
                    try {
                        data.limit = parseInt(args[0]);
                        data.seconds = parseInt(args[1]);
                    } catch (ex) {

                    }

                }
                dispatch({
                    type: types.GET_HOTEL_REFRESH_TIMES,
                    config: data
                });
            },
            error => {
                dispatch({
                    type: types.GET_HOTEL_REFRESH_TIMES,
                    config: data
                });
            }
        );
    };
}
